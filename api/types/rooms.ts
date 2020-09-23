interface IRoom {
  roomId: string;
  roomNumber: number;
  roomType: string;
  isEmpty: number;
}

type IRoomCollection = Array<IRoom>

export {
  IRoom,
  IRoomCollection
}
