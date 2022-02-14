import ErrorFactory from '../../error/error-factory';
import InvalidRequestError from '../errors/invalid-request-error';
import { ControllerRequest } from '../types/controller-request';

type ComplexConverterFactorySetting = {
  argumentName: string,
  desiredName?: string,
  valueConverter?: ValueConverter
  optional?: boolean;
};

type ValueConverter = (value: string) => any;

export type ConverterFactorySettings = (ComplexConverterFactorySetting | string)[];

export type RequestConverter = (request: ControllerRequest) => any;

export default function makeInputConverter(
  ...settings: ConverterFactorySettings
): RequestConverter {
  const settingsMap = getSettingsMap(settings);
  const optionalArgs = getOptionalArgumentsMap(settingsMap);
  return function inputConverter(request: ControllerRequest) {
    const { args } = request;

    if (args.length < (settingsMap.size - optionalArgs.size)) {
      throw ErrorFactory.getInstance().makeError(InvalidRequestError);
    }

    const returnedObject: { [k:string]: any } = {};

    const usedArgNames = new Set<string>();

    args.forEach(({ name, value }) => {
      if (usedArgNames.has(name)) {
        throw ErrorFactory.getInstance().makeError(InvalidRequestError);
      }
      const argSetting = settingsMap.get(name);
      if (argSetting) {
        returnedObject[argSetting.desiredName] = argSetting.valueConverter(value);
        usedArgNames.add(name);
      }
    });

    optionalArgs.forEach((setting, key) => {
      if (!usedArgNames.has(key)) {
        usedArgNames.add(key);
        returnedObject[key] = undefined;
      }
    });

    if (usedArgNames.size !== settingsMap.size) {
      throw ErrorFactory.getInstance().makeError(InvalidRequestError);
    }

    return returnedObject;
  };
}

function getSettingsMap(
  settings: ConverterFactorySettings,
): Map<string, { desiredName: string, valueConverter: ValueConverter, optional: boolean }> {
  const settingsMap = new Map<string, {
    desiredName: string,
    valueConverter: ValueConverter,
    optional: boolean }>();

  settings.forEach((setting) => {
    const argName = getArgumentNameFromSetting(setting);
    settingsMap.set(argName, {
      optional: getOptionalFlagValueFromSetting(setting),
      desiredName: getDesiredNameFromSetting(setting),
      valueConverter: getValueConverterFromSetting(setting),
    });
  });

  return settingsMap;
}

function getArgumentNameFromSetting(setting: string | ComplexConverterFactorySetting): string {
  return typeof setting === 'string' ? setting : setting.argumentName;
}

function getDesiredNameFromSetting(setting: string | ComplexConverterFactorySetting): string {
  return typeof setting === 'string' ? setting : setting.desiredName ?? setting.argumentName;
}

function getOptionalFlagValueFromSetting(
  setting: string | ComplexConverterFactorySetting,
): boolean {
  return typeof setting === 'string' ? false : setting.optional ?? false;
}

function getValueConverterFromSetting(
  setting: string | ComplexConverterFactorySetting,
): ValueConverter {
  const fakeConverter = (value: string) => value;
  return typeof setting === 'string' ? fakeConverter : setting.valueConverter ?? fakeConverter;
}

function getOptionalArgumentsMap(
  settingsMap: Map<
  string,
  { desiredName: string, valueConverter: ValueConverter, optional: boolean }
  >,
): Map<
  string,
  { desiredName: string, valueConverter: ValueConverter, optional: boolean }
  > {
  const optionalArgs = new Map<
  string,
  { desiredName: string, valueConverter: ValueConverter, optional: boolean }>();
  // eslint-disable-next-line no-restricted-syntax
  for (const [name, setting] of settingsMap.entries()) {
    // eslint-disable-next-line no-plusplus
    if (setting.optional) optionalArgs.set(name, setting);
  }
  return optionalArgs;
}
