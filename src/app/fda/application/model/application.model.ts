/*
export interface ApplicationSrs {
  id?: number;
  appType?: string;
  appNumber?: string;
  title?: string;
  sponsorName?: string;
  nonProprietaryName?: string;
  submitDate?: string;
  appSubType?: string;
  divisionClassDesc?: string;
  status?: string;
  center?: string;
  source?: string;
  publicDomain?: string;
  version?: number;
  provenance?: string;
  externalTitle?: string;
  statusDate?: number;
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
  internalVersion?: number;
  isDisabled?: boolean;
  applicationProductList?: Array<ProductSrs>;
  applicationIndicationList?: Array<ApplicationIndicationSrs>;
  clinicalTrialList?: Array<ClinicalTrial>;
  productTechEffectList?: Array<ProductTechnicalEffect>;
  productEffectedList?: Array<ProductEffected>;
  applicationHistoryList?: Array<ApplicationSrsHistory>;
}
*/

/*
export interface ProductSrs {
  id?: number;
  productName?: string;
  amount?: number;
  dosageForm?: string;
  routeAdmin?: string;
  unitPresentation?: string;
  unit?: string;
  reviewedBy?: string;
  reviewDate?: number;
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
  internalVersion?: number;
  applicationProductNameList?: Array<ProductNameSrs>;
  applicationIngredientList?: Array<ApplicationIngredient>;
}

export interface ProductNameSrs {
  id?: number;
  productName?: string;
  productNameType?: string;
  provenance?: string;
  deprecated?: string;
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
  internalVersion?: number;
}

export interface ApplicationIndicationSrs {
  id?: number;
  indication?: string;
  amount?: number;
  dosageForm?: string;
  routeAdmin?: string;
  unitPresentation?: string;
  unit?: string;
  reviewedBy?: string;
  reviewDate?: number;
  internalVersion?: number;
}

*/

// GSRS 3.0 in Spring Boot
export interface Application {
  id?: number;
  center?: string;
  appType?: string;
  appNumber?: string;
  title?: string;
  externalTitle?: string;
  sponsorName?: string;
  nonProprietaryName?: string;
  appSubType?: string;
  divisionClassDesc?: string;
  status?: string;
  submitDate?: string;
  statusDate?: number;
  source?: string;
  publicDomain?: string;
  version?: number;
  provenance?: string;
  isDisabled?: boolean;
  internalVersion?: number;
  createdBy?: string;
  creationDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
  applicationProductList?: Array<Product>;
  applicationIndicationList?: Array<ApplicationIndication>;
  _clinicalTrialList?: Array<ClinicalTrial>;
//  productTechEffectList?: Array<ProductTechnicalEffect>;
//  productEffectedList?: Array<ProductEffected>;
//  applicationHistoryList?: Array<ApplicationSrsHistory>;
}

export interface Product {
  id?: number;
  productName?: string;
  amount?: number;
  dosageForm?: string;
  routeAdmin?: string;
  unitPresentation?: string;
  unit?: string;
  reviewedBy?: string;
  reviewDate?: number;
  createdBy?: string;
  creationDate?: number;
  modifiedBy?: string;
  lastModifiedDate?: number;
  internalVersion?: number;
  applicationProductNameList?: Array<ProductName>;
  applicationIngredientList?: Array<ApplicationIngredient>;
}

export interface ProductName {
  id?: number;
  productName?: string;
  productNameType?: string;
  provenance?: string;
  deprecated?: string;
  createdBy?: string;
  creationDate?: number;
  modifiedBy?: string;
  lastModifiedDate?: number;
  internalVersion?: number;
}

export interface ApplicationIngredient {
  id?: number;
  applicantIngredName?: string;
//  bdnum?: string;
//  basisOfStrengthBdnum?: string;
  substanceKey?: string;
  substanceKeyType?: string;
  basisOfStrengthSubstanceKey?: string;
  basisOfStrengthSubstanceKeyType?: string;
  average?: string;
  low?: string;
  high?: string;
  lowLimit?: string;
  highLimit?: string;
  nonNumericValue?: string;
  ingredientType?: string;
  unit?: string;
  grade?: string;
  reviewedBy?: string;
  reviewDate?: number;
  internalVersion?: number;
  createdBy?: string;
  creationDate?: number;
  modifiedBy?: string;
  lastModifiedDate?: number;
 // farmSubstanceId?: number;
 // farmSubstance?: string;
  _substanceUuid?: string;
 // _approvalID?: string;
  _ingredientName?: string;
  $$ingredientNameValidation?: string;
  $$basisOfStrengthValidation?: string;
//  _basisOfStrengthSubstanceUuid?: string;
//  _basisOfStrengthApprovalID?: string;
//  _basisOfStrengthIngredientName?: string;
//  activeMoietyName?: string;
//  activeMoietyUnii?: string;
//  subRelationshipList?: Array<SubRelationship>;
}

export interface ApplicationIndication {
  id?: number;
  indication?: string;
  internalVersion?: number;
}

export interface SubRelationship {
  id?: string;
  substanceId?: string;
  ownerBdnum?: string;
  relationshipType?: string;
  relationshipName?: string;
  relationshipUnii?: string;
}

export interface ProductTechnicalEffect {
  id?: number;
  technicalEffect?: string;
  farmTechEffectId?: number;
  substanceId?: number;
  createdBy?: string;
  createDate?: number;
  internalVersion?: number;
}

export interface ProductEffected {
  id?: number;
  effectedProduct?: string;
  farmProductId?: number;
  substanceId?: number;
  createdBy?: string;
  createDate?: number;
  internalVersion?: number;
}

export interface ApplicationSrsHistory {
  id?: number;
  productName?: string;
  sponsorName?: string;
  status?: string;
  statusDate?: number;
  createDate?: number;
}

export interface ClinicalTrial {
  nctNumber?: String;
}

export interface ValidationResults {
  valid?: boolean;
  validationMessages?: Array<ValidationMessage>;
}

export interface ValidationMessage {
  actionType?: string;
  appliedChange?: boolean;
  links?: Array<MessageLink>;
  message?: string;
  messageType?: string;
  suggestedChange?: boolean;
}

export interface MessageLink {
  href: string;
  text: string;
}

/* Application All Models */

export interface ApplicationAll {
  id?: string;
  appType?: string;
  appNumber?: string;
  sponsorName?: string;
  appStatus?: string;
  divisionClassDesc?: string;
  appSubType?: string;
  center?: string;
  fromTable?: string;
  inDarrtsDetail?: string;
  provenance?: string;
  substanceId?: string;
  name?: string;
  bdnum?: string;
  unii?: string;
  productName?: string;
  appCount?: string;
  ingredientType?: string;
  applicationProductList?: Array<ProductSrsAll>;
  indicationList?: Array<AppIndicationAll>;
}

export interface ProductSrsAll {
  id?: string;
  appType?: string;
  appNumber?: string;
  productName?: string;
  dosageForm?: string;
  applicationProductNameList?: Array<ProductNameSrsAll>;
  applicationIngredientList?: Array<AppIngredientAll>;
}

export interface ProductNameSrsAll {
  id?: string;
  productName?: string;
  fromTable?: string;
  applicationProductNameList?: Array<ProductName>;
  applicationIngredientList?: Array<ApplicationIngredient>;
}

export interface AppIngredientAll {
  id?: string;
  applicantIngredName?: string;
  bdnum?: string;
  ingredientType?: string;
}

export interface AppIndicationAll {
  id?: number;
  productName?: string;
  amount?: number;
  dosageForm?: string;
  routeAdmin?: string;
  unitPresentation?: string;
  unit?: string;
  reviewedBy?: string;
  reviewDate?: number;
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
  internalVersion?: number;
  applicationProductNameList?: Array<ProductName>;
  applicationIngredientList?: Array<ApplicationIngredient>;
}

export interface SubstanceApplicationMatch {
  id?: number;
  appType?: string;
  appNumber?: string;
  status?: string;
  appSubType?: string;
  productName?: string;
  bdnum?: string;
  exactMatchName?: string;
  exactMatchBdnum?: string;
}
