import ErrorFactory from '../../error/error-factory';
import InvalidRequestError from '../errors/invalid-request-error';
import { ControllerRequest } from '../types/controller-request';

type ComplexConverterFactorySetting = {
  argumentName: string,
  desiredName?: string,
  valueConverter?: (value: string) => any,
};

type ConverterFactorySettings = (ComplexConverterFactorySetting | string)[];

type Converter = (request: ControllerRequest) => any;

export default function makeInputConverter(...settings: ConverterFactorySettings): Converter {
  return function inputConverter(request: ControllerRequest) {
    const { args } = request;

    if (args.length < settings.length) {
      throw ErrorFactory.getInstance().makeError(InvalidRequestError);
    }

    const returnedObject: { [k: string]: any } = {};

    args.forEach(({ name, value }) => {
      const argSetting = getSettingsForArgName(name);
      let actualArgName;
      let actualArgValue;
      if (isComplexSetting(argSetting)) {
        ({ actualArgName, actualArgValue } = applySettingsForArgument(name, value));
      } else {
        [actualArgName, actualArgValue] = [name, value];
      }
      if (actualArgName in returnedObject) {
        throw ErrorFactory.getInstance().makeError(InvalidRequestError);
      }
      returnedObject[actualArgName] = actualArgValue;
    });

    return returnedObject;
  };

  function applySettingsForArgument(
    argName: string,
    argValue: string,
  ): { actualArgName: string, actualArgValue: any } {
    const setting = getSettingsForArgName(argName);
    if (isComplexSetting(setting)) {
      const valueConverter = setting.valueConverter ?? ((val: string) => val);
      return {
        actualArgName: setting.desiredName ?? argName,
        actualArgValue: valueConverter(argValue),
      };
    }
    return {
      actualArgName: argName,
      actualArgValue: argValue,
    };
  }

  function getSettingsForArgName(argName: string): ComplexConverterFactorySetting | string {
    const foundSetting = settings.find((setting) => {
      const expectedArgName = isComplexSetting(setting) ? setting.argumentName : setting;
      return argName === expectedArgName;
    });

    if (foundSetting) {
      return foundSetting;
    }
    throw ErrorFactory.getInstance().makeError(InvalidRequestError);
  }

  function isComplexSetting(
    setting: string | ComplexConverterFactorySetting,
  ): setting is ComplexConverterFactorySetting {
    return typeof setting !== 'string';
  }
}
