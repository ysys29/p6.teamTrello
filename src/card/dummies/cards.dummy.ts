// createListDto
export const dummyCreateCardDto = {
  id: 1,
  listId: 1,
  title: 'Test List',
  content: 'Hello',
  color: '#899',
};

// card join with cardmember
export const dummyCardJoinCardMmber = {
  id: 1,
  listId: 1,
  title: '튜터님께 질문',
  content: '어떤 방법이 좋은지 여쭤보기',
  color: '#ffffff',
  lexoRank: '0|i00003:',
  deadline: null,
  createdAt: '2024-07-12T07:39:23.941Z',
  updatedAt: '2024-07-13T03:04:11.000Z',
  deletedAt: null,
  cardMembers: [
    {
      id: 5,
      cardId: 22,
      userId: 1,
      createdAt: '2024-07-15T23:39:28.463Z',
      updatedAt: '2024-07-15T23:39:28.463Z',
    },
    {
      id: 6,
      cardId: 22,
      userId: 2,
      createdAt: '2024-07-15T23:39:33.758Z',
      updatedAt: '2024-07-15T23:39:33.758Z',
    },
  ],
};
