import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from 'n8n-workflow';
import {
  GLOBAL_PROMPTS_CREDENTIALS_NAME,
  GlobalPromptsCredentialsData,
} from '../../credentials/GlobalPrompts.credentials';

export class GlobalPrompts implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Global Prompts',
    name: 'globalPrompts',
    icon: 'file:globalprompts.svg',
    group: ['transform', 'output'],
    version: 1,
    description: 'Insert prompts from credentials',
    defaults: {
      name: 'Global Prompts',
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: GLOBAL_PROMPTS_CREDENTIALS_NAME,
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Put All Prompts in One Key',
        name: 'putAllInOneKey',
        type: 'boolean',
        default: true,
        description: 'Whether to put all prompts in a single key',
      },
      {
        displayName: 'Prompts Key Name',
        name: 'promptsKeyName',
        type: 'string',
        default: 'prompts',
        displayOptions: {
          show: {
            putAllInOneKey: [true],
          },
        },
        description: 'Name of the key to store all prompts under',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const credentials = (await this.getCredentials(
      GLOBAL_PROMPTS_CREDENTIALS_NAME,
    )) as unknown as GlobalPromptsCredentialsData;

    const promptTexts = credentials.prompts?.prompt?.map((p) => p.text) || [];

    const putAllInOneKey = this.getNodeParameter('putAllInOneKey', 0) as boolean;

    let promptsData: { [key: string]: any } = {};

    if (putAllInOneKey) {
      const promptsKeyName = this.getNodeParameter('promptsKeyName', 0) as string;
      promptsData = { [promptsKeyName]: promptTexts };
    } else {
      promptTexts.forEach((text, index) => {
        promptsData[`prompt${index + 1}`] = text;
      });
    }

    const returnData = this.getInputData();
    if (returnData.length === 0) {
      returnData.push({ json: promptsData });
    } else {
      returnData.forEach((item) => {
        item.json = {
          ...item.json,
          ...promptsData,
        };
      });
    }

    return [returnData];
  }
}
