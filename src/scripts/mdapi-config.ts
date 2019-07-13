/**
 * @name MdapiConfig
 * @author brianewardsaunders 
 * @date 2019-07-10
 */

import { DescribeMetadataResult, MetadataObject, FileProperties, QueryResult } from "jsforce";
import { Org } from "@salesforce/core";
import { MdapiCommon } from "./mdapi-common";
import path = require('path');

export interface IConfig {
  metadataTypes: Array<string>; // e.g. ['ApexClass', 'CustomObjet'] // from describeMetada also acts a key index for metadataObjectLookup and metadataObjectMembersLookup
  metadataFolders: Array<string>;  // e.g. ['ReportFolder', 'DocumentFolder'] // don't exist so inject
  metadataTypeChildren: Array<string>; // e.g. ['CustomField']; // exist only within childXmlNames
  metadataObjectLookup: Record<string, MetadataObject>; // e.g. {'ApexClass, Array<MetadataObject>} quick lookup to object based on meta type name
  metadataObjectMembersLookup: Record<string, Array<FileProperties>>; // e.g. {'ApexClass', Array<FileProperties>} where files are members 
  metadataDirectoryLookup: Record<string, Array<MetadataObject>>; // e.g. {'objects', Array<MetaObject>} // one directory can have multiple types.
  metadataObjects: Array<MetadataObject>; // e.g. directly from describemetadata.metadataObjects
};

export interface ISettings {
  ignoreHiddenOrNonEditable?: boolean;
  ignoreInstalled?: boolean;
  ignoreNamespaces?: boolean;
  ignoreStaticResources?: boolean;
  ignoreFolders?: boolean;
  apiVersion: string;
}

export class MdapiConfig {

  public static forceapp: string = 'force-app';
  public static unpackagedFolder: string = 'unpackaged';
  public static srcFolder: string = 'src';
  public static manifestFolder: string = 'manifest';
  public static unpackagedZip: string = 'unpackaged.zip';
  public static packageXml: string = 'package.xml';
  public static packageManifest: string = 'package.manifest';
  public static destructiveChangesXml: string = 'destructiveChanges.xml';

  public static StaticResource: string = 'StaticResource';
  public static PermissionSet: string = 'PermissionSet';
  public static FlexiPage: string = 'FlexiPage';
  public static StandardValueSet: string = 'StandardValueSet';
  public static Settings: string = 'Settings';
  public static RecordType: string = 'RecordType';
  public static PersonAccount: string = 'PersonAccount';
  public static Dashboard: string = 'Dashboard';
  public static Document: string = 'Document';
  public static Email: string = 'Email';
  public static EmailTemplate: string = 'EmailTemplate';
  public static Report: string = 'Report';
  public static Folder: string = 'Folder';
  public static ReportFolder: string = 'ReportFolder';
  public static EmailFolder: string = 'EmailFolder';
  public static DocumentFolder: string = 'DocumentFolder';
  public static DashboardFolder: string = 'DashboardFolder';
  //https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_managedtopics.htm
  public static ManagedTopic: string = 'ManagedTopic';
  public static ApexClass: string = 'ApexClass';
  public static ApexComponent: string = 'ApexComponent';
  public static ApexPage: string = 'ApexPage';
  public static ApexTrigger: string = 'ApexTrigger';
  public static LightningComponentBundle: string = 'LightningComponentBundle';
  public static AuraDefinitionBundle: string = 'AuraDefinitionBundle';
  public static Translation: string = 'Translation';
  public static CustomPermission: string = 'CustomPermission';
  public static CustomLabel: string = 'CustomLabel';
  public static SharingReason: string = 'SharingReason';
  public static CompactLayout: string = 'CompactLayout';
  public static PlatformCachePartition: string = 'PlatformCachePartition';
  public static DeveloperName: string = 'DeveloperName';

  // special case e.g. static resources
  //public static metaSuffix: string = "-meta";
  public static metaXmlSuffix: string = "-meta.xml";

  /** SPECIFIC DIR CONSTANTS*/
  public static aura: string = "aura";
  public static lwc: string = "lwc";
  public static objects: string = "objects";
  public static dashboards: string = "dashboards";
  public static email: string = "email";
  public static reports: string = "reports";
  public static documents: string = "documents";
  public static profiles: string = "profiles";
  public static settings: string = "settings";

  /** BOT HANDLE VARIABLES */
  // https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_bot.htm
  public static bots: string = 'bots';
  public static Bot: string = 'Bot';
  public static BotVersion: string = 'BotVersion';
  public static botVersions: string = 'botVersions';

  /** META TYPES */
  public static Profile: string = "Profile";
  public static CustomObject: string = "CustomObject";
  public static CustomField: string = "CustomField";
  public static Index: string = "Index";
  public static BusinessProcess: string = "BusinessProcess";
  public static WebLink: string = "WebLink";
  public static ValidationRule: string = "ValidationRule";
  public static ListView: string = "ListView";
  public static FieldSet: string = "FieldSet";

  public static WorkflowAlert: string = "WorkflowAlert";
  public static WorkflowFieldUpdate: string = "WorkflowFieldUpdate";
  public static WorkflowFlowAction: string = "WorkflowFlowAction";
  public static WorkflowKnowledgePublish: string = "WorkflowKnowledgePublish";
  public static WorkflowOutboundMessage: string = "WorkflowOutboundMessage";
  public static WorkflowSend: string = "WorkflowSend";
  public static WorkflowRule: string = "WorkflowRule";
  public static WorkflowTask: string = "WorkflowTask";

  //https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_assignmentrule.htm
  public static AssignmentRule: string = "AssignmentRule";
  //https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_autoresponserules.htm 
  public static AutoResponseRule: string = "AutoResponseRule";
  //https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_escalationrules.htm
  public static EscalationRule: string = "EscalationRule";
  //https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_matchingrule.htm
  public static MatchingRule: string = "MatchingRule";
  //https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_sharingrules.htm
  public static SharingOwnerRule: string = "SharingOwnerRule";
  public static SharingCriteriaRule: string = "SharingCriteriaRule";
  public static SharingTerritoryRule: string = "SharingTerritoryRule";

  // the double barrel name exceptions
  public static keywords: string = "keywords";
  public static moderation: string = "moderation";
  public static userCriteria: string = "userCriteria";
  public static duplicateRules: string = "duplicateRules";
  public static customMetadata: string = "customMetadata";

  public static fields: string = "fields";
  public static indexes: string = "indexes";
  public static businessProcesses: string = "businessProcesses";
  public static recordTypes: string = "recordTypes";
  public static compactLayouts: string = "compactLayouts";
  public static webLinks: string = "webLinks";
  public static validationRules: string = "validationRules";
  public static sharingReasons: string = "sharingReasons";
  public static listViews: string = "listViews"
  public static fieldSets: string = "fieldSets";
  public static labels: string = "labels";
  //https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_workflow.htm
  public static alerts: string = "alerts";
  public static fieldUpdates: string = "fieldUpdates";
  public static flowActions: string = "flowActions";
  public static knowledgePublishes: string = "knowledgePublishes";
  public static outboundMessages: string = "outboundMessages";
  public static rules: string = "rules";
  public static tasks: string = "tasks";
  //https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_assignmentrule.htm
  public static assignmentRule: string = "assignmentRule";
  //https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_autoresponserules.htm
  public static autoresponseRule: string = "autoresponseRule";
  //https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_escalationrules.htm
  public static escalationRule: string = "escalationRule";
  //https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_matchingrule.htm
  public static matchingRules: string = "matchingRules";
  //https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_sharingrules.htm
  public static sharingCriteriaRules: string = "sharingCriteriaRules";
  public static sharingOwnerRules: string = "sharingOwnerRules";
  public static sharingTerritoryRules: string = "sharingTerritoryRules";

  //name field used in metadata object files 
  public static fullName: string = "fullName";
  public static label: string = "label";
  public static _text: string = "_text";
  public static columns: string = "columns";

  //https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_retrieveresult.htm
  public static beta: string = 'beta';
  public static deleted: string = 'deleted';
  public static deprecated: string = 'deprecated';
  public static installed: string = 'installed';
  public static released: string = 'released';
  public static unmanaged: string = 'unmanaged';

  // https://developer.salesforce.com/docs/atlas.en-us.packagingGuide.meta/packagingGuide/packaging_component_attributes.htm
  public static hiddenOrNonEditableInstalledMetaTypes = [
    // following are (hidden or non-editable) if managed
    MdapiConfig.ApexClass,
    MdapiConfig.ApexComponent,
    MdapiConfig.ApexPage,
    MdapiConfig.ApexTrigger,
    MdapiConfig.AuraDefinitionBundle,
    MdapiConfig.LightningComponentBundle,
    MdapiConfig.StaticResource,
    MdapiConfig.PermissionSet,
    MdapiConfig.FlexiPage,
    MdapiConfig.Translation,
    MdapiConfig.CustomPermission,
    MdapiConfig.PlatformCachePartition,
    MdapiConfig.SharingReason
    // check if following should be included 
    // 'CompactLayout', 
    // 'CustomLabel',  
    // 'HomePageComponent',
    // 'CustomSetting 
  ];

  public static unsupportedMetadataTypes = [
    MdapiConfig.ManagedTopic
  ]; // cannot query listmetadata (error invalid parameter value) with api 46.0

  // https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/standardvalueset_names.htm
  public static standardValueSets: Array<string> = [
    "AccountContactMultiRoles",
    "AccountContactRole",
    "AccountOwnership",
    "AccountRating",
    "AccountType",
    "AssetStatus",
    "CampaignMemberStatus",
    "CampaignStatus",
    "CampaignType",
    "CaseContactRole",
    "CaseOrigin",
    "CasePriority",
    "CaseReason",
    "CaseStatus",
    "CaseType",
    "ContactRole",
    "ContractContactRole",
    "ContractStatus",
    "EntitlementType",
    "EventSubject",
    "EventType",
    "FiscalYearPeriodName",
    "FiscalYearPeriodPrefix",
    "FiscalYearQuarterName",
    "FiscalYearQuarterPrefix",
    "IdeaCategory1",
    "IdeaMultiCategory",
    "IdeaStatus",
    "IdeaThemeStatus",
    "Industry",
    "LeadSource",
    "LeadStatus",
    "OpportunityCompetitor",
    "OpportunityStage",
    "OpportunityType",
    "OrderStatus",
    "OrderType",
    "PartnerRole",
    "Product2Family",
    "QuestionOrigin1",
    "QuickTextCategory",
    "QuickTextChannel",
    "QuoteStatus",
    "RoleInTerritory2",
    "SalesTeamRole",
    "Salutation",
    "ServiceContractApprovalStatus",
    "SocialPostClassification",
    "SocialPostEngagementLevel",
    "SocialPostReviewedStatus",
    "SolutionStatus",
    "TaskPriority",
    "TaskStatus",
    "TaskSubject",
    "TaskType",
    "WorkOrderLineItemStatus",
    "WorkOrderPriority",
    "WorkOrderStatus"
  ];

  public static bundleDirectories: Array<string> = [
    MdapiConfig.lwc,
    MdapiConfig.aura
  ];

  public static folderDirectories: Array<string> = [
    MdapiConfig.dashboards,
    MdapiConfig.documents,
    MdapiConfig.email,
    MdapiConfig.reports
  ];

  public static metadataFolders: Array<string> = [
    MdapiConfig.DashboardFolder,
    MdapiConfig.DocumentFolder,
    MdapiConfig.EmailFolder,
    MdapiConfig.ReportFolder
  ];

  public static metadataTypeFolderLookup: Record<string, string> = {
    "Dashboard": MdapiConfig.DashboardFolder,
    "Document": MdapiConfig.DocumentFolder,
    "EmailTemplate": MdapiConfig.EmailFolder, // does not follow typical name and folder convention
    "Report": MdapiConfig.ReportFolder
  };

  // CHECK THIS WITH SALESFORCE RELEASE NOTE THE FOLLOWING IS NOT SUPPORTED WITH SFDX AS PART OF API VERSION 46.0
  // FUTURE ENHANCEMENT MAKE THIS A PARAM TO INPUT JSON FILE
  // this must match above directory as of API VERSION 46.0 only applicable to sfdx force:source:retrieve or force:mdapi:convert
  public static nonSfdxSupportedDirectories = [
    'animationRules',
    'audience',
    'bots'
  ];

  // this must match above directory
  public static nonSfdxSupportedMetaTypes = [
    'AnimationRule',
    'Audience',
    'Bot'
  ];

  // exclude from diff compare
  public static directoryExcludes = [
    "src"
  ];

  // exclude from diff compare
  public static fileExcludes = [
    "jsconfig",
    "eslintrc",
    "package.xml"
  ];

  public static childMetadataDirectories = [
    //label
    MdapiConfig.labels,
    //object
    MdapiConfig.fields,
    MdapiConfig.indexes,
    MdapiConfig.businessProcesses,
    MdapiConfig.recordTypes,
    MdapiConfig.compactLayouts,
    MdapiConfig.webLinks,
    MdapiConfig.validationRules,
    MdapiConfig.sharingReasons,
    MdapiConfig.listViews,
    MdapiConfig.fieldSets,
    //workflow
    MdapiConfig.alerts,
    MdapiConfig.fieldUpdates,
    MdapiConfig.flowActions,
    MdapiConfig.knowledgePublishes,
    MdapiConfig.outboundMessages,
    MdapiConfig.rules,
    MdapiConfig.tasks,
    //assignment rule
    MdapiConfig.assignmentRule,
    //auto response rule
    MdapiConfig.autoresponseRule,
    //escalation rule
    MdapiConfig.escalationRule,
    //matching rule
    MdapiConfig.matchingRules,
    // sharing rules
    MdapiConfig.sharingOwnerRules,
    MdapiConfig.sharingCriteriaRules,
    MdapiConfig.sharingTerritoryRules,
    //ManagedTopic (is uppercase) - wierd
    MdapiConfig.ManagedTopic,
    //botversions
    MdapiConfig.botVersions
  ];

  public static childMetadataDirectoryLookup = {
    //Custom Label
    CustomLabel: MdapiConfig.labels,
    //Cusom Object
    CustomField: MdapiConfig.fields,
    Index: MdapiConfig.indexes,
    BusinessProcess: MdapiConfig.businessProcesses,
    RecordType: MdapiConfig.recordTypes,
    CompactLayout: MdapiConfig.compactLayouts,
    WebLink: MdapiConfig.webLinks,
    ValidationRule: MdapiConfig.validationRules,
    SharingReason: MdapiConfig.sharingReasons,
    ListView: MdapiConfig.listViews,
    FieldSet: MdapiConfig.fieldSets,
    //Workflow
    WorkflowAlert: MdapiConfig.alerts,
    WorkflowFieldUpdate: MdapiConfig.fieldUpdates,
    WorkflowSend: MdapiConfig.flowActions, // check this
    WorkflowKnowledgePublish: MdapiConfig.knowledgePublishes,
    WorkflowOutboundMessage: MdapiConfig.outboundMessages,
    WorkflowRule: MdapiConfig.rules,
    WorkflowTask: MdapiConfig.tasks,
    //Assignment rule (singular)
    AssignmentRule: MdapiConfig.assignmentRule,
    //Auto Response Rule (singular)
    AutoResponseRule: MdapiConfig.autoresponseRule,
    //Escalation Rule (singular)
    EscalationRule: MdapiConfig.escalationRule,
    //Matching Rules (plural)
    MatchingRule: MdapiConfig.matchingRules,
    //SharingOwnerRule
    SharingOwnerRule: MdapiConfig.sharingOwnerRules,
    SharingCriteriaRule: MdapiConfig.sharingCriteriaRules,
    SharingTerritoryRule: MdapiConfig.sharingTerritoryRules,
    //ManagedTopic
    ManagedTopic: MdapiConfig.ManagedTopic,
    //Botversion
    BotVersions: MdapiConfig.botVersions
  };

  public static childMetadataObjectLookup = {
    //label
    "labels": MdapiConfig.CustomLabel,
    //object
    "fields": MdapiConfig.CustomField,
    "indexes": MdapiConfig.Index,
    "businessProcesses": MdapiConfig.BusinessProcess,
    "recordTypes": MdapiConfig.RecordType,
    "compactLayouts": MdapiConfig.CompactLayout,
    "webLinks": MdapiConfig.WebLink,
    "validationRules": MdapiConfig.ValidationRule,
    "sharingReasons": MdapiConfig.SharingReason,
    "listViews": MdapiConfig.ListView,
    "fieldSets": MdapiConfig.FieldSet,
    //workflow
    "alerts": MdapiConfig.WorkflowAlert,
    "fieldUpdates": MdapiConfig.WorkflowFieldUpdate,
    "flowActions": MdapiConfig.WorkflowSend, // check this
    "knowledgePublishes": MdapiConfig.WorkflowKnowledgePublish,
    "outboundMessages": MdapiConfig.WorkflowOutboundMessage,
    "rules": MdapiConfig.WorkflowRule,
    "tasks": MdapiConfig.WorkflowTask,
    //assignment rule (singular)
    "assignmentRule": MdapiConfig.AssignmentRule,
    //auto Response Rule (singular)
    "autoResponseRule": MdapiConfig.AutoResponseRule,
    //escalation Rule (singular)
    "escalationRule": MdapiConfig.EscalationRule,
    //matching Rules (plural)
    "matchingRules": MdapiConfig.MatchingRule,
    //SharingOwnerRule
    "sharingOwnerRules": MdapiConfig.SharingOwnerRule,
    "sharingCriteriaRules": MdapiConfig.SharingCriteriaRule,
    "sharingTerritoryRules": MdapiConfig.SharingTerritoryRule,
    //ManagedTopic
    "ManagedTopic": MdapiConfig.ManagedTopic,
    //botversions
    "botVersions": MdapiConfig.BotVersion
  };

  public static isFolderDirectory(directory: string): boolean {
    let returned: boolean = false;
    MdapiConfig.folderDirectories.forEach((element: string) => {
      if (element === directory) {
        returned = true;
        return; // break inner loop
      }// end if
    });
    return returned;
  }// end method

  public static isBundleDirectory(directory: string): boolean {
    let returned: boolean = false;
    MdapiConfig.bundleDirectories.forEach((element: string) => {
      if (element === directory) {
        returned = true;
        return; // break inner loop
      }// end if
    });
    return returned;
  }// end method

  public static isExcludedFile(input: string): boolean {
    let excluded: boolean = false;
    MdapiConfig.fileExcludes.forEach(element => {
      if (element === input) {
        excluded = true;
        return; // break inner loop
      }// end if
    });
    return excluded;
  }// end method

  public static isExcludedDirectory(input: string): boolean {
    let excluded: boolean = false;
    MdapiConfig.directoryExcludes.forEach(element => {
      if (element === input) {
        excluded = true;
        return; // break inner loop
      }// end if
    });
    return excluded;
  }// end method

  public static isUnsupportedMetaType(metaType: string): boolean {
    for (var x: number = 0; x < MdapiConfig.unsupportedMetadataTypes.length; x++) {
      let unsupportedMetadataType: string = MdapiConfig.unsupportedMetadataTypes[x];
      if (unsupportedMetadataType === metaType) { return true; }// end if
    }// end for
    return false;
  }// end method

  protected static isHiddenOrNonEditable(metaItem: FileProperties): boolean {

    if ((metaItem && metaItem.manageableState) &&
      (metaItem.manageableState === MdapiConfig.installed)) {
      for (var x: number = 0; x < MdapiConfig.hiddenOrNonEditableInstalledMetaTypes.length; x++) {
        let hiddenMetaType: string = MdapiConfig.hiddenOrNonEditableInstalledMetaTypes[x];
        if (hiddenMetaType === metaItem.type) {
          return true;
        }// end if
      }// end for
    }// end if
    return false;

  }// end method

  public static ignoreHiddenOrNonEditable(settings: ISettings, metaItem: FileProperties): boolean {

    if (!settings.ignoreHiddenOrNonEditable) { return false; }
    return MdapiConfig.isHiddenOrNonEditable(metaItem);

  }// end method

  protected static isIgnoreNamespaces(metaItem: FileProperties): boolean {

    return (metaItem.namespacePrefix && (metaItem.namespacePrefix !== null) &&
      (metaItem.namespacePrefix !== '')); // pi or Finserv etc

  }// end method 

  public static ignoreNamespaces(settings: ISettings, metaItem: FileProperties): boolean {

    if (!settings.ignoreNamespaces) { return false; }
    return MdapiConfig.isIgnoreNamespaces(metaItem);

  }// end method 

  protected static isIgnoreInstalled(metaItem: FileProperties): boolean {

    return (metaItem.manageableState &&
      (metaItem.manageableState === MdapiConfig.installed));

  }// end method 

  public static ignoreInstalled(settings: ISettings, metaItem: FileProperties): boolean {

    if (!settings.ignoreInstalled) {
      return false;
    }// end if
    return MdapiConfig.isIgnoreInstalled(metaItem);

  }// end method 

  public static toSortedMembers(fileProperties: Array<FileProperties>): Array<string> {
    let members: Array<string> = [];
    for (var x: number = 0; (fileProperties && (x < fileProperties.length)); x++) {
      let fileProps: FileProperties = fileProperties[x];
      members.push(fileProps.fullName);
    }
    return members.sort();
  }// end method

  /**
   * used to setup additional metadata types e.g. Folders (ReportFolder) and Children (e.g. CustomField)
   * @param config 
   * @param metaTypeNameArray 
   */
  public static describeMetadataArray(config: IConfig, metaTypeNameArray: Array<string>) {

    for (var x: number = 0; x < metaTypeNameArray.length; x++) {

      let metaTypeName: string = metaTypeNameArray[x];
      config.metadataTypes.push(metaTypeName);
      config.metadataObjectMembersLookup[metaTypeName] = [];
      // there is no specific directory for other types e.g. customfield for mdapi

      config.metadataObjectLookup[metaTypeName] = (<MetadataObject>
        {
          directoryName: MdapiConfig.childMetadataDirectoryLookup[metaTypeName],
          inFolder: false,
          metaFile: false,
          suffix: null,
          xmlName: metaTypeName,
          childXmlNames: null
        });

    }// end for

  }// end method

  /**
   * describeMetadata will populate config variables based on describe results
   * 
   * @param org 
   * @param config 
   * @param settings 
   */
  public static describeMetadata(org: Org, config: IConfig, settings: ISettings): Promise<void> {

    return new Promise((resolve, reject) => {

      org.getConnection().metadata.describe(settings.apiVersion).then((result: DescribeMetadataResult) => {

        try {

          let metadataObjects: Array<MetadataObject> = result.metadataObjects;
          config.metadataObjects = metadataObjects;

          for (var x: number = 0; x < metadataObjects.length; x++) {

            let metadataObject: MetadataObject = metadataObjects[x];
            let metaTypeName: string = metadataObject.xmlName;
            let directoryName: string = metadataObject.directoryName;

            if (MdapiConfig.isUnsupportedMetaType(metaTypeName)) { continue; }

            if (settings.ignoreStaticResources && (metaTypeName === MdapiConfig.StaticResource)) {
              continue;
            }// end if

            if (settings.ignoreFolders && metadataObject.inFolder) {
              continue;
            }// end if

            config.metadataTypes.push(metaTypeName);
            config.metadataObjectMembersLookup[metaTypeName] = [];
            config.metadataObjectLookup[metaTypeName] = metadataObject;

            // set directory lookup
            let lookupArray: Array<MetadataObject> = config.metadataDirectoryLookup[directoryName];
            if (!lookupArray) { lookupArray = []; }// end if init array
            lookupArray.push(metadataObject);
            config.metadataDirectoryLookup[directoryName] = lookupArray;

            // setup folders
            if (metadataObject.inFolder) {
              let metaTypeFolderName: string = MdapiConfig.metadataTypeFolderLookup[metaTypeName];
              config.metadataFolders.push(metaTypeFolderName); // e.g. ReportFolder
            }// end if

            // setup child metadata
            if (metadataObject.childXmlNames && (metadataObject.childXmlNames instanceof Array)) {

              for (var y: number = 0; y < metadataObject.childXmlNames.length; y++) {
                let childXmlName = metadataObject.childXmlNames[y];
                if (MdapiConfig.isUnsupportedMetaType(childXmlName)) { continue; }
                config.metadataTypeChildren.push(childXmlName);
              }// end for

            }// end if

          }// end for

          MdapiConfig.describeMetadataArray(config, config.metadataFolders);

          MdapiConfig.describeMetadataArray(config, config.metadataTypeChildren);

          config.metadataTypeChildren.forEach((childmetaType: string) => {
            let childMetadataObject = config.metadataObjectLookup[childmetaType];
            let childDirectoryName: string = MdapiConfig.childMetadataDirectoryLookup[childmetaType];
            let lookupArray: Array<MetadataObject> = config.metadataDirectoryLookup[childDirectoryName];
            if (!lookupArray) { lookupArray = []; }// end if init array
            lookupArray.push(childMetadataObject);
            config.metadataDirectoryLookup[childDirectoryName] = lookupArray;
          });

          config.metadataTypes.sort();

          resolve();
        } catch (exception) {
          console.error(exception);
          reject(exception);
        }

      }, (error: any) => {
        console.error(error);
        reject(error);
      });// end describe

    });// end promise

  }// end method

  /**
   * set StandardValueSets not queryable  
   * https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/standardvalueset_names.htm
   * @param config 
   */
  public static setStandardValueSets(config: IConfig): void {

    for (var x: number = 0; x < MdapiConfig.standardValueSets.length; x++) {
      config.metadataObjectMembersLookup[MdapiConfig.StandardValueSet].push((<FileProperties>
        {
          "type": MdapiConfig.StandardValueSet,
          "createdById": null,
          "createdByName": null,
          "createdDate": null,
          "fileName": null,
          "fullName": MdapiConfig.standardValueSets[x],
          "id": null,
          "lastModifiedById": null,
          "lastModifiedByName": null,
          "lastModifiedDate": null,
          "manageableState": null,
          "namespacePrefix": null,
        })
      );
    }// end for

  }// end method

  /**
   * Queries and includes ommitted RecordTypes into config
   * @param org 
   * @param config 
   */
  public static async resolvePersonAccountRecordTypes(org: Org, config: IConfig): Promise<any> {

    return new Promise((resolve, reject) => {

      org.getConnection().query("SELECT DeveloperName, SobjectType, IsPersonType FROM RecordType " +
        " WHERE SobjectType = 'Account' AND IsPersonType = true").then((result: QueryResult<any>) => {

          if (result.records) {

            for (var x: number = 0; x < result.records.length; x++) {

              let record: Object = result.records[x];
              let personRecordType: string = (MdapiConfig.PersonAccount + MdapiCommon.DOT + record[MdapiConfig.DeveloperName]);

              config.metadataObjectMembersLookup[MdapiConfig.RecordType].push(
                (<FileProperties>{
                  type: MdapiConfig.RecordType,
                  createdById: null,
                  createdByName: null,
                  createdDate: null,
                  fileName: null,
                  fullName: personRecordType,
                  id: null,
                  lastModifiedById: null,
                  lastModifiedByName: null,
                  lastModifiedDate: null,
                  manageableState: null,
                  namespacePrefix: null
                })// end push
              );
            }// end for
          }// end if
          resolve();
        }, (error: any) => {
          reject(error);
        });

    });// end promise

  }// end method

  /**
   * repositionSettings at end in prep for package.xml creation
   * @param config 
   */
  public static repositionSettings(config: IConfig): void {

    let found: boolean = false;
    for (var x: number = 0; x < config.metadataTypes.length; x++) {
      if (config.metadataTypes[x] === MdapiConfig.Settings) {
        config.metadataTypes.splice(x, 1);
        found = true;
        break;
      }// end if
    }// end if
    if (found) {
      config.metadataTypes.push(MdapiConfig.Settings);
    }// end if

  }// end method

  public static getMetadataNameFromCurrentDirectory(parentDirectory: string): string {
    let segments: Array<string> = parentDirectory.split(path.sep);
    return segments[segments.length - 1]; //  one up
  }// end method

  public static getMetadataNameFromParentDirectory(parentDir: string): string {
    let segments: Array<string> = parentDir.split(path.sep);
    return segments[segments.length - 2]; // two up
  }// end method

  public static isolateMetadataObjectName(fileName: string): string {

    if (fileName.endsWith(MdapiConfig.metaXmlSuffix)) {
      fileName = fileName.replace(MdapiConfig.metaXmlSuffix, MdapiCommon.BLANK);
    }// end if

    let items: Array<string> = fileName.split(MdapiCommon.DOT);

    if (items.length > 1) {
      items.splice((items.length - 1), 1);
    }// end if

    return MdapiCommon.join(items, MdapiCommon.DOT);

    //let offset: number = 1;
    //let fileSuffix: string = items[items.length - 1];

    /* if (fileSuffix === 'xml') {// metatype
        let fileSub = items[items.length - 2];
        if (fileSub.endsWith("-meta")) {
            offset = 2;
        }// end if
        for (var x: number = 1; x < (items.length - offset); x++) {
            returned += ('.' + items[x]);
        }// end for
    }// end if
    else if (fileSuffix === 'md') { // handle custom metadata
        for (var x: number = 1; x < (items.length - offset); x++) {
            returned += ('.' + items[x]);
        }// end for
    }// end if */

  }// end method

  public static getMetadataObjectFromDirectoryName(config: IConfig, directoryName: string, metaFile?: string): MetadataObject {

    let metadataObjects: Array<MetadataObject> = MdapiCommon.objectToArray(config.metadataDirectoryLookup[directoryName]);

    if (metadataObjects.length == 1) {
      return metadataObjects[0]; // if one only return one
    }// end if
    for (var x: number = 0; x < metadataObjects.length; x++) {
      let metaObject: MetadataObject = metadataObjects[x];
      if (metaFile.endsWith(metaObject.suffix) ||
        metaFile.endsWith(metaObject.suffix + MdapiConfig.metaXmlSuffix)) { // e.g. for moderation different types
        return metaObject;
      }// end if
    }// end for
    return null; // try to resolve as next step
  }// end method

  public static createConfig(): IConfig {
    return (<IConfig>{
      metadataTypes: [],
      metadataFolders: [],
      metadataTypeChildren: [],
      metadataObjectLookup: {},
      metadataObjectMembersLookup: {},
      metadataDirectoryLookup: {},
      metadataObjects: []
    });
  }// end method

  public static createSettings(): ISettings {
    return (<ISettings>{
      ignoreHiddenOrNonEditable: false,
      ignoreInstalled: false,
      ignoreNamespaces: false,
      ignoreStaticResources: false,
      ignoreFolders: false,
      apiVersion: null
    });
  }

}// end class