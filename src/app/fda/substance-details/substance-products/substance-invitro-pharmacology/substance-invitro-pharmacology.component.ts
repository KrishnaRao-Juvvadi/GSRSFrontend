import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

/* GSRS Core Imports */
import { ConfigService } from '@gsrs-core/config';
import { AuthService } from '@gsrs-core/auth';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { LoadingService } from '@gsrs-core/loading/loading.service';
import { Facet, FacetParam, FacetHttpParams, FacetQueryResponse } from '@gsrs-core/facets-manager';
import { SubstanceDetailsBaseTableDisplay } from '../substance-details-base-table-display';
import { SubstanceCardBaseFilteredList } from '@gsrs-core/substance-details';
import { ExportDialogComponent } from '@gsrs-core/substances-browse/export-dialog/export-dialog.component';

/* GSRS Invitro Pharmacology Imports */
import { InvitroPharmacologyService } from '../../../invitro-pharmacology/service/invitro-pharmacology.service';
import { invitroPharmacologySearchSortValues } from '../../../invitro-pharmacology/invitro-pharmacology-browse/invitro-pharmacology-search-sort-values';
import { GeneralService } from '../../../service/general.service';
import { InvitroAssayInformation, InvitroAssayScreening } from '../../../invitro-pharmacology/model/invitro-pharmacology.model';

@Component({
  selector: 'app-substance-invitro-pharmacology',
  templateUrl: './substance-invitro-pharmacology.component.html',
  styleUrls: ['./substance-invitro-pharmacology.component.scss']
})
export class SubstanceInvitroPharmacologyComponent extends SubstanceDetailsBaseTableDisplay implements OnInit, OnDestroy {

  @Input() substance: any;
  @Input() substanceUuid: string;
  @Input() substanceUnii: string;
  @Input() substanceName: string;
  @Output() countInvitroPharmScreeningOut: EventEmitter<number> = new EventEmitter<number>();

  assays: Array<InvitroAssayInformation> = [];
  assayScreening: any;
  id: string;
  assayTargetSubId = '';
  testCompoundSubId = '';
  ligandSubId = '';
  controlSubId = '';
  loadingStatus = '';
  assayTargetSubNameMatch = false;
  testCompoundSubNameMatch = false;
  ligandSubNameMatch = false;
  controlSubNameMatch = false;
  showSpinner = false;
  privateExport = false;
  disableExport = false;

  // Search variables
  //public privateSearchBase = 'root_invitroAssayScreenings_invitroAssayResultInformation_invitroTestAgent_testAgentSubstanceKey:';
  public privateSearchBase = 'entity_link_substances:';

  public privateSearch?: string;
  public privateSearchTerm?: string;
  private privateFacetParams: FacetParam;
  public sortValues = invitroPharmacologySearchSortValues;
  invitroPharmTotalRecords = 0;
  pageIndex = 0;
  pageSize = 5;
  order = '$root_modifiedDate';
  ascDescDir = 'desc';
  etag = '';

  private subscriptions: Array<Subscription> = [];

  testAgentScreeningColumns: string[] = [
    'viewDetails',
    'testAgent',
    'assayTargetName',
    'bioassayType',
    'referenceSource',
    'testAgentConcentration',
    'resultValue',
    'calculatedValue'
    // 'controls'
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    public gaService: GoogleAnalyticsService,
    private loadingService: LoadingService,
    private invitroPharmService: InvitroPharmacologyService,
    private generalService: GeneralService,
    private dialog: MatDialog
  ) {
    super(gaService, invitroPharmService);
  }

  ngOnInit() {
    const rolesSubscription = this.authService.hasAnyRolesAsync('Admin', 'Updater', 'SuperUpdater').subscribe(response => {
      this.isAdmin = response;
    });
    this.subscriptions.push(rolesSubscription);

    if (this.substanceUuid) {
      this.privateSearch = this.privateSearchBase + '\"' + this.substanceUuid + '\"';
      this.getInvitroPharm();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
  }

  getInvitroPharm(pageEvent?: PageEvent, searchType?: string) {
    this.setPageEvent(pageEvent);
    this.showSpinner = true;  // Start progress spinner
    const skip = this.page * this.pageSize;

    // Clear/reset the array
    this.assays = [];

    const subscription = this.invitroPharmService.getInvitroPharmacology(
      this.order,
      skip,
      this.pageSize,
      this.privateSearch,
      this.privateFacetParams)
      .subscribe(pagingResponse => {
        if (pagingResponse.total > 0) {

          let searchResults = pagingResponse.content;
          this.etag = pagingResponse.etag;

          this.invitroPharmTotalRecords = pagingResponse.total;
          this.countInvitroPharmScreeningOut.emit(pagingResponse.total);

          searchResults.forEach(assay => {
            if (assay) {
              const assayObj: any = {};
              assayObj.id = assay.id;
              assayObj.targetName = assay.targetName;
              assayObj.targetNameApprovalId = assay.targetNameApprovalId;
              assayObj.targetNameSubstanceKey = assay.targetNameSubstanceKey;
              assayObj.bioassayType = assay.bioassayType;
              assayObj.studyType = assay.studyType;

              assayObj.screeningList = [];

              assay.invitroAssayScreenings.forEach(screening => {
                if (screening.invitroAssayResultInformation) {

                  // Get Reference Source Type and Id
                  assayObj.referenceSourceTypeAndId = this.getReferenceFields(screening);

                  if (screening.invitroAssayResultInformation.invitroTestAgent) {

                    // if Test Agent Substance UUID matching with this substance, display screening data
                    if (screening.invitroAssayResultInformation.invitroTestAgent.testAgent) {
                      if (screening.invitroAssayResultInformation.invitroTestAgent.testAgentSubstanceKey == this.substanceUuid) {

                        assayObj.testAgent = screening.invitroAssayResultInformation.invitroTestAgent.testAgent;

                        /* Invitro Reference Object exists */
                        /*
                        if (screening.invitroAssayResultInformation.invitroReference) {
                          let referenceSourceTypeNumber = '';
                          let referenceSourceType = '';
                          let referenceSource = '';
                          if (screening.invitroAssayResultInformation.invitroReference.referenceSourceType) {
                            referenceSourceType = screening.invitroAssayResultInformation.invitroReference.referenceSourceType;
                          }
                          if (screening.invitroAssayResultInformation.invitroReference.referenceSource) {
                            referenceSource = screening.invitroAssayResultInformation.invitroReference.referenceSource;
                          }

                          referenceSourceTypeNumber = referenceSourceType + ' ' + referenceSource;
                          assayObj.referenceSourceTypeNumber = referenceSourceTypeNumber;
                        } // if invitroReference exists
                        */

                        /* Invitro Assay Result Object exists */
                        if (screening.invitroAssayResult) {
                          assayObj.testAgentConcentration = screening.invitroAssayResult.testAgentConcentration;
                          assayObj.testAgentConcentrationUnits = screening.invitroAssayResult.testAgentConcentrationUnits;

                          assayObj.resultValue = screening.invitroAssayResult.resultValue;
                          assayObj.resultValueUnits = screening.invitroAssayResult.resultValueUnits;

                          // Calculate IC50 Value
                          if ((screening.invitroAssayResult.testAgentConcentration) && (screening.invitroAssayResult.resultValue)) {
                            //  assayObj.calculateIC50Value = this.calculate1C50Value(screening.invitroAssayResult.testAgentConcentration, screening.invitroAssayResult.resultValue);
                          } // Result exists

                          /* Invitro Assay Control exists */
                          if (screening.invitroControls.length > 0) {
                            assayObj.controls = screening.invitroControls;
                          }

                          if ((screening.invitroAssayResult.testAgentConcentration) && (screening.invitroAssayResult.resultValue)) {
                            screening._calculateIC50Value = this.calculate1C50Value(screening.invitroAssayResult.testAgentConcentration, screening.invitroAssayResult.resultValue);
                          }
                        }

                        assayObj.screeningList.push(screening);

                      } // testAgentSubstanceUuid is same as this substance
                    } // if Test Agent exists
                  } // if invitroTestAgent Object exists
                }  // invitroAssayResultInformation
              });
              this.assays.push(assayObj);
            } // if assay
          });

          // Set the array data to display on the table
          this.setResultData(this.assays);
        }
      }, error => {
        this.showSpinner = false;  // Stop progress spinner
        console.log('error');
      }, () => {
        this.showSpinner = false;  // Stop progress spinner
        subscription.unsubscribe();
      });
    this.loadingStatus = '';
    // this.showSpinner = false;  // Stop progress spinner
  }

  getReferenceFields(screening: InvitroAssayScreening): any {
    let referenceSourceType = '';
    let referenceSourceId = '';
    let referenceSourceTypeAndId = '';

    if (screening.invitroAssayResultInformation) {

      if (screening.invitroAssayResultInformation.invitroReferences.length > 0) {
        screening.invitroAssayResultInformation.invitroReferences.forEach(reference => {
          if (reference) {
            if (reference.primaryReference) {
              if (reference.primaryReference == true) {
                if (reference.sourceType) {
                  referenceSourceType = reference.sourceType;
                }
                if (reference.sourceId) {
                  referenceSourceId = reference.sourceId;
                }
                referenceSourceTypeAndId = referenceSourceType + ' ' + referenceSourceId;
              } // if primaryReference is true
            } // if primaryRefernce is not null
          }
        });
      }
    }

    return referenceSourceTypeAndId;
  }

  calculate1C50Value(testAgentConcentration: number, resultValue: number): string {
    let resultType = 'IC50';
    let calculateIC50Value = '';
    // resultType = IC50
    // if percentInhibition/resultValue < 30, then IC50 > Test Agent Concentration
    // if percentInhibition/resultValue between 30 and 60, then IC50 approx. = Test Agent Concentration
    // if percentInhibition/resultValue above 60, then IC50 < Test Agent Concentration
    if (resultValue) {
      if (resultValue < 30) {
        calculateIC50Value = resultType + ' > ' + testAgentConcentration;
      } else if (resultValue >= 30 && resultValue <= 60) {
        calculateIC50Value = resultType + ' approx. = ' + testAgentConcentration;
      } else if (resultValue > 60) {
        calculateIC50Value = resultType + ' < ' + testAgentConcentration;
      }
    }

    return calculateIC50Value;
  }

  getSubstanceNames(localName: string): boolean {
    this.substance.names.forEach(element => {
      if (element) {
        if (element.name) {
          if (element.name === localName) {
            return true;
          } else {
            return false;
          }
        }
      }
    });
    return false;
  }

  export() {
    if (this.etag) {
      const extension = 'xlsx';
      const url = this.getApiExportUrl(this.etag, extension);
      if (this.authService.getUser() !== '') {
        const dialogReference = this.dialog.open(ExportDialogComponent, {
          // height: '215x',
          width: '700px',
          data: { 'extension': extension, 'type': 'substanceInvitroPharmacology', 'entity': 'invitropharmacology', 'hideOptionButtons': true }
        });
        // this.overlayContainer.style.zIndex = '1002';
        dialogReference.afterClosed().subscribe(response => {
          // this.overlayContainer.style.zIndex = null;
          const name = response.name;
          const id = response.id;
          if (name && name !== '') {
            this.loadingService.setLoading(true);
            const fullname = name + '.' + extension;
            this.authService.startUserDownload(url, this.privateExport, fullname, id).subscribe(response => {
              // this.authService.startUserDownload(url, this.privateExport, fullname).subscribe(response => {
              this.loadingService.setLoading(false);
              const navigationExtras: NavigationExtras = {
                queryParams: {
                  totalSub: this.invitroPharmTotalRecords
                }
              };
              const params = { 'total': this.invitroPharmTotalRecords };
              this.router.navigate(['/user-downloads/', response.id]);
            }, error => this.loadingService.setLoading(false));
          }
        });
      }
    }
  }

  getApiExportUrl(etag: string, extension: string): string {
    return this.invitroPharmService.getApiExportUrl(etag, extension);
  }

  formatValue(v) {
    if (v) {
      if (typeof v === 'object') {
        if (v.display) {
          return v.display;
        } else if (v.value) {
          return v.value;
        } else {
          return null;
        }
      } else {
        return v;
      }
    }
    return null;
  }

  displayAmount(amt: any): string {
    let ret = '';
    if (amt) {
      //if (typeof assay === 'object') {
      //  if (amt) {

      let addedunits = false;
      let unittext = this.formatValue(amt.amountUnits);
      if (!unittext) {
        unittext = '';
      }
      const atype = this.formatValue(amt.amountType);
      if (atype) {
        ret += atype + '\n';
      }
      if (amt.amountAverage || amt.amountHigh || amt.amountLow) {
        if (amt.amountAverage) {
          ret += amt.amountAverage;
          if (amt.amountUnits) {
            ret += ' ' + unittext;
            addedunits = true;
          }
        }
        if (amt.amountHigh || amt.amountLow) {
          ret += ' [';
          if (amt.amountHigh && !amt.amountLow) {
            ret += '<' + amt.amountHigh;
          } else if (!amt.amountHigh && amt.amountLow) {
            ret += '>' + amt.amountLow;
          } else if (amt.amountHigh && amt.amountLow) {
            ret += amt.amountLow + ' to ' + amt.amountHigh;
          }
          ret += '] ';
          if (!addedunits) {
            if (amt.amountUnits) {
              ret += ' ' + unittext;
              addedunits = true;
            }
          }
        }
        ret += ' (average) ';
      }

      /*
      if (amt.highLimit || amt.lowLimit) {
        ret += '\n[';
      }
      if (amt.highLimit && !amt.lowLimit) {
        ret += '<' + amt.highLimit;
      } else if (!amt.highLimit && amt.lowLimit) {
        ret += '>' + amt.lowLimit;
      } else if (amt.highLimit && amt.lowLimit) {
        ret += amt.lowLimit + ' to ' + amt.highLimit;
      }
      if (amt.highLimit || amt.lowLimit) {
        ret += '] ';
        if (!addedunits) {
          if (amt.units) {
            ret += ' ' + unittext;
            addedunits = true;
          }
        }
        ret += ' (limits)';
      }
      */
      //     }
      //      }
    }
    return ret;
  }

}
