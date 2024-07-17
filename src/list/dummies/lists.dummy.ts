// lists
export const dummyLists = [
  {
    id: 1,
    boardId: 1,
    title: 'Dummy List 1',
    lexoRank: '0|hzzzzz:',
    createdAt: '2024-07-11T23:38:14.927Z',
    updatedAt: '2024-07-11T23:38:14.927Z',
    deletedAt: null,
  },
  {
    id: 2,
    boardId: 1,
    title: 'Dummy List 2',
    lexoRank: '0|i00007:',
    createdAt: '2024-07-12T23:38:14.927Z',
    updatedAt: '2024-07-12T23:38:14.927Z',
    deletedAt: null,
  },
  {
    id: 3,
    boardId: 1,
    title: 'Dummy List 3',
    lexoRank: '0|i0000f:',
    createdAt: '2024-07-13T23:38:14.927Z',
    updatedAt: '2024-07-13T23:38:14.927Z',
    deletedAt: null,
  },
  {
    id: 4,
    boardId: 1,
    title: 'Dummy List 4',
    lexoRank: '0|i0000n:',
    createdAt: '2024-07-14T23:38:14.927Z',
    updatedAt: '2024-07-14T23:38:14.927Z',
    deletedAt: null,
  },
  {
    id: 5,
    boardId: 1,
    title: 'Dummy List 5',
    lexoRank: '0|i0000v:',
    createdAt: '2024-07-15T23:38:14.927Z',
    updatedAt: '2024-07-15T23:38:14.927Z',
    deletedAt: null,
  },
];

// board join
export const dummyListWithBoard = {
  id: 1,
  boardId: 1,
  title: 'Dummy List 1',
  lexoRank: '0|hzzzzz:',
  createdAt: '2024-07-11T23:38:14.927Z',
  updatedAt: '2024-07-11T23:38:14.927Z',
  deletedAt: null,
  board: {
    id: 1,
    ownerId: 1,
    title: 'Dummy Board 1',
    description: 'Dummy Board 1 Description',
    color: '#ffff',
    createdAt: '2024-07-10T23:32:36.143Z',
    updatedAt: '2024-07-10T23:32:36.143Z',
    deletedAt: null,
  },
};

// board & card join
export const dummyListWithBoardAndCards = {
  id: 1,
  boardId: 1,
  title: 'Dummy List 1',
  lexoRank: '0|hzzzzz:',
  createdAt: '2024-07-11T23:38:14.927Z',
  updatedAt: '2024-07-11T23:38:14.927Z',
  deletedAt: null,
  cards: [
    {
      // 두번째 순서
      id: 1,
      listId: 1,
      title: 'Dummy Card 1',
      content: 'Dummy Card 1 Content',
      color: '#ffff',
      lexoRank: '0|i00007:',
      deadline: '2024-07-25T23:38:14.927Z',
      createdAt: '2024-07-12T23:38:14.927Z',
      updatedAt: '2024-07-12T23:38:14.927Z',
      deletedAt: null,
    },
    {
      // 세번째 순서
      id: 2,
      listId: 1,
      title: 'Dummy Card 2',
      content: 'Dummy Card 2 Content',
      color: '#ffff',
      lexoRank: '0|i0000f:',
      deadline: '2024-07-25T23:38:14.927Z',
      createdAt: '2024-07-12T23:38:14.927Z',
      updatedAt: '2024-07-12T23:38:14.927Z',
      deletedAt: null,
    },
    {
      // 첫번째 순서
      id: 3,
      listId: 1,
      title: 'Dummy Card 3',
      content: 'Dummy Card 3 Content',
      color: '#ffff',
      lexoRank: '0|hzzzzz:',
      deadline: '2024-07-25T23:38:14.927Z',
      createdAt: '2024-07-12T23:38:14.927Z',
      updatedAt: '2024-07-12T23:38:14.927Z',
      deletedAt: null,
    },
  ],
  board: {
    id: 1,
    ownerId: 1,
    title: 'Dummy Board 1',
    description: 'Dummy Board 1 Description',
    color: '#ffff',
    createdAt: '2024-07-10T23:32:36.143Z',
    updatedAt: '2024-07-10T23:32:36.143Z',
    deletedAt: null,
  },
};

// createListDto
export const dummyCreateListDto = {
  boardId: 1,
  title: 'Test List',
};
