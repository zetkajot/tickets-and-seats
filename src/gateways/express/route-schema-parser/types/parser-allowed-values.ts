import ParserTypes from './parser-types';
import { ParserUtilityFunction } from './parser-utility-function';

export type ParserAllowedValues = string | number | boolean | ParserUtilityFunction | ParserTypes;
