interface IRoom {
  roomId: string;
  roomNumber: number;
  roomType: string;
}

type IRoomCollection = Array<IRoom>

export {
  IRoom,
  IRoomCollection
}
