import { Component, OnInit } from '@angular/core';
import { CheckboxWidget } from 'ngx-schema-form';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-custom-multi-checkbox-widget',
  templateUrl: './custom-multi-checkbox-widget.component.html',
  styleUrls: ['./custom-multi-checkbox-widget.component.scss']
})
export class CustomMultiCheckboxWidgetComponent  extends CheckboxWidget implements OnInit {
  options = [];

  constructor(
    private cvService: ControlledVocabularyService,
    private dialog: MatDialog
  ) { 
    super();
    
  }

  ngOnInit(): void {
    if (this.schema.CVDomain) {

   
    this.cvService.fetchFullVocabulary(this.schema.CVDomain).subscribe(response => {
      if (response.content && response.content.length > 0) {
        this.options = response.content[0].terms;
      }
    });

    
    }
  }
  openModal(templateRef, comments) {
    let dialogRef = this.dialog.open(templateRef, {
    width: '300px', data: {comment: comments}
  });

  }
}