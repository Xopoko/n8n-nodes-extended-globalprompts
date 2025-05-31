import { ICredentialType, INodeProperties } from 'n8n-workflow';

export const GLOBAL_PROMPTS_CREDENTIALS_NAME = 'globalPrompts';

export class GlobalPromptsCredentials implements ICredentialType {
  name = GLOBAL_PROMPTS_CREDENTIALS_NAME;
  displayName = 'Global Prompts';

  properties: INodeProperties[] = [
    {
      displayName: 'Prompts',
      name: 'prompts',
      type: 'fixedCollection',
      default: {},
      typeOptions: {
        multipleValues: true,
        multipleValueButtonText: 'Add Prompt',
      },
      options: [
        {
          displayName: 'Prompt',
          name: 'prompt',
          values: [
            {
              displayName: 'Prompt Text',
              name: 'text',
              type: 'string',
              default: '',
              typeOptions: {
                rows: 4,
              },
            },
          ],
        },
      ],
    },
  ];
}

export interface GlobalPromptsCredentialsData {
  prompts: {
    prompt: Array<{
      text: string;
    }>;
  };
}
