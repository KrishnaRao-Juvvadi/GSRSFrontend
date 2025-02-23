import { EventEmitter } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { QueryStatement } from './query-statement/query-statement.model';

export interface QueryableSubstanceDictionary {
    [displayName: string]: {
        lucenePath: string;
        description: string;
        type: string;
        cvDomain?: string;
        priority?: string;
        suggest?: string;
    };
}

export interface CommandTypesDict {
    [commandType: string]: CommandDict;
}

export interface CommandDict {
    [command: string]: Command | CommandInput;
}

export interface Command {
    commandInputs?: Array<CommandInput>;
}

export interface CommandInput {
    type?: string;
    example?: string;
    constructQuery?: (
        queryValue: string | Date | number,
        condition: string,
        queryableProperty: string,
        lucenePath: string,
        eventEmitter: EventEmitter<QueryStatement>,
        queryParts?: Array<string>,
        commandInputValues?: Array<string | Date | number>
    ) => void;
}
