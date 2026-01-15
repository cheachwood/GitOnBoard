// Adresse du contrat déployé
// TODO: Remplacer par l'adresse après déploiement
export const JOB_BOARD_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3';
export const CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID) || 31337;

// ABI du smart contract JobBoard
export const JOB_BOARD_ABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'CandidateAlreadyAssigned',
    type: 'error',
  },
  {
    inputs: [],
    name: 'CandidateEmailEmpty',
    type: 'error',
  },
  {
    inputs: [],
    name: 'CandidateNameEmpty',
    type: 'error',
  },
  {
    inputs: [],
    name: 'CannotApplyToOwnJob',
    type: 'error',
  },
  {
    inputs: [],
    name: 'CannotChangeCompletedOrCancelledJob',
    type: 'error',
  },
  {
    inputs: [],
    name: 'CannotSetInProgressWithoutCandidate',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidTransitionFromInProgress',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidTransitionFromOpen',
    type: 'error',
  },
  {
    inputs: [],
    name: 'JobDoesNotExist',
    type: 'error',
  },
  {
    inputs: [],
    name: 'JobNotOpenForAssignment',
    type: 'error',
  },
  {
    inputs: [],
    name: 'OnlyAuthorCanPerformAction',
    type: 'error',
  },
  {
    inputs: [],
    name: 'OnlyAuthorOrOwnerCanToggle',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'OwnableInvalidOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    inputs: [],
    name: 'StatusAlreadySet',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint32',
        name: 'jobId',
        type: 'uint32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'candidateAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'candidateName',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'candidateEmail',
        type: 'string',
      },
    ],
    name: 'CandidateAssigned',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint32',
        name: 'jobId',
        type: 'uint32',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'isActive',
        type: 'bool',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'author',
        type: 'address',
      },
    ],
    name: 'JobToggled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint32',
        name: 'jobId',
        type: 'uint32',
      },
      {
        indexed: true,
        internalType: 'enum JobBoard.Status',
        name: 'newStatus',
        type: 'uint8',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'author',
        type: 'address',
      },
    ],
    name: 'JobUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint32',
        name: 'jobId',
        type: 'uint32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'author',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint32',
        name: 'dailyRate',
        type: 'uint32',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'description',
        type: 'string',
      },
    ],
    name: 'NewJob',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'uint32',
        name: 'jobId',
        type: 'uint32',
      },
      {
        internalType: 'string',
        name: 'candidateName',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'candidateEmail',
        type: 'string',
      },
    ],
    name: 'assigneCandidate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint32',
        name: 'jobId',
        type: 'uint32',
      },
      {
        internalType: 'enum JobBoard.Status',
        name: 'newStatus',
        type: 'uint8',
      },
    ],
    name: 'changeJobStatus',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint32',
        name: 'dailyRate',
        type: 'uint32',
      },
      {
        internalType: 'string',
        name: 'description',
        type: 'string',
      },
    ],
    name: 'createJob',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getActiveJobs',
    outputs: [
      {
        components: [
          {
            internalType: 'uint32',
            name: 'id',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'creationDate',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'dailyRate',
            type: 'uint32',
          },
          {
            internalType: 'enum JobBoard.Status',
            name: 'status',
            type: 'uint8',
          },
          {
            internalType: 'bool',
            name: 'isActive',
            type: 'bool',
          },
          {
            internalType: 'address',
            name: 'author',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'candidate',
            type: 'address',
          },
          {
            internalType: 'string',
            name: 'candidateName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'candidateEmail',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'description',
            type: 'string',
          },
        ],
        internalType: 'struct JobBoard.Job[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllJobs',
    outputs: [
      {
        components: [
          {
            internalType: 'uint32',
            name: 'id',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'creationDate',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'dailyRate',
            type: 'uint32',
          },
          {
            internalType: 'enum JobBoard.Status',
            name: 'status',
            type: 'uint8',
          },
          {
            internalType: 'bool',
            name: 'isActive',
            type: 'bool',
          },
          {
            internalType: 'address',
            name: 'author',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'candidate',
            type: 'address',
          },
          {
            internalType: 'string',
            name: 'candidateName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'candidateEmail',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'description',
            type: 'string',
          },
        ],
        internalType: 'struct JobBoard.Job[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint32',
        name: 'jobId',
        type: 'uint32',
      },
    ],
    name: 'getJob',
    outputs: [
      {
        components: [
          {
            internalType: 'uint32',
            name: 'id',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'creationDate',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'dailyRate',
            type: 'uint32',
          },
          {
            internalType: 'enum JobBoard.Status',
            name: 'status',
            type: 'uint8',
          },
          {
            internalType: 'bool',
            name: 'isActive',
            type: 'bool',
          },
          {
            internalType: 'address',
            name: 'author',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'candidate',
            type: 'address',
          },
          {
            internalType: 'string',
            name: 'candidateName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'candidateEmail',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'description',
            type: 'string',
          },
        ],
        internalType: 'struct JobBoard.Job',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint32',
        name: 'jobId',
        type: 'uint32',
      },
    ],
    name: 'toggleJobActive',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint32',
        name: 'jobId',
        type: 'uint32',
      },
      {
        internalType: 'uint32',
        name: 'dailyRate',
        type: 'uint32',
      },
      {
        internalType: 'string',
        name: 'description',
        type: 'string',
      },
    ],
    name: 'updateJob',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
