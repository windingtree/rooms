import { v4 as uuidv4 } from 'uuid'

const helpers = (function () {
  function newRoom(attrs = {}) {
    const room = {
      roomNumber: attrs.roomNumber || 'Room Number',
      roomType: attrs.roomType || 'Room Type',
      roomId: uuidv4(),
      isEmpty: 1,
    };

    return room;
  }

  function findById(array, id, cb) {
    array.forEach((el) => {
      if (el.id === id) {
        cb(el);
        return;
      }
    });
  }

  function renderElapsedString(isEmpty) {
    if (isEmpty === 1) {
      return 'Empty'
    }
    return 'Taken'
  }

  return {
    newRoom,
    findById,
    renderElapsedString,
  };
}());

export { helpers }
