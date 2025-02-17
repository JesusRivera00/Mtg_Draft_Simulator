import React, { useState } from 'react';
import axios from 'axios';

const Rooms: React.FC = () => {
  const [roomName, setRoomName] = useState<string>('');
  const [roomId, setRoomId] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleCreateRoom = async () => {
    try {
      const response = await axios.post<{ roomId: string }>('http://localhost:3000/api/rooms', { name: roomName });
      setMessage(`Room created with ID: ${response.data.roomId}`);
    } catch (error) {
      setMessage(`Error creating room: ${(error as any).response.data}`);
    }
  };

  const handleJoinRoom = async () => {
    try {
      const response = await axios.post<{ room: { name: string } }>('http://localhost:3000/api/rooms/join', { roomId });
      setMessage(`Joined room: ${response.data.room.name}`);
    } catch (error) {
      setMessage(`Error joining room: ${(error as any).response.data}`);
    }
  };

  return (
    <div>
      <h2>Create Room</h2>
      <input
        type="text"
        placeholder="Room Name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <button onClick={handleCreateRoom}>Create Room</button>

      <h2>Join Room</h2>
      <input
        type="text"
        placeholder="Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={handleJoinRoom}>Join Room</button>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Rooms;