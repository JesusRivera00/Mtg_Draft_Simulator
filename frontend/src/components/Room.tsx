import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import supabase from '../supabaseClient';

interface Set {
  code: string;
  name: string;
  set_type: string;
}

interface Seat {
  id: number;
  user_id: string | null;
  is_bot: boolean;
  seat_index: number;
}

interface CreateRoomResponse {
  roomId: string;
  seats: Seat[];
}

interface JoinRoomResponse {
  seats: Seat[];
}

interface FetchSeatsResponse {
  seats: Seat[];
}

const Room: React.FC = () => {
  const { roomId: paramRoomId } = useParams<{ roomId: string }>();
  const [roomId, setRoomId] = useState<string>(paramRoomId || '');
  const [sets, setSets] = useState<Set[]>([]);
  const [selectedSet, setSelectedSet] = useState<string>('');
  const [roomName, setRoomName] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [seats, setSeats] = useState<Seat[]>([]);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSets = async () => {
      try {
        const response = await axios.get('https://api.scryfall.com/sets');
        const mainSets = response.data.data.filter((set: Set) =>
          ['core', 'masters'].includes(set.set_type)
        );
        setSets(mainSets);
      } catch (error: any) {
        setMessage(`Error fetching sets: ${error.response?.data?.error || error.message}`);
      }
    };

    fetchSets();
  }, []);

  const handleCreateRoom = async () => {
    try {
      const response = await axios.post<CreateRoomResponse>('http://localhost:3000/api/rooms', { name: roomName, userId });
      setMessage('Room created and joined successfully');
      setRoomId(response.data.roomId);
      setSeats(response.data.seats);
      navigate(`/room/${response.data.roomId}`);
    } catch (error: any) {
      setMessage(`Error creating room: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleJoinRoom = async () => {
    try {
      const response = await axios.post<JoinRoomResponse>('http://localhost:3000/api/rooms/join', { roomId, userId });
      setMessage('Joined room successfully');
      setSeats(response.data.seats);
      navigate(`/room/${roomId}`);
    } catch (error: any) {
      setMessage(`Error joining room: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleStartDraft = async () => {
    try {
      console.log(`Starting draft for room ${roomId} with set ${selectedSet}`);
      const response = await axios.post('http://localhost:3000/api/rooms/start', { roomId, setName: selectedSet });
      console.log('Draft start response:', response.data);
      console.log(`Draft started for room ${roomId}`);
      navigate('/draft', { state: { setName: selectedSet, roomId } });
    } catch (error: any) {
      console.error('Error starting draft:', error);
      setMessage(`Error starting draft: ${error.response?.data?.error || error.message}`);
    }
  };

  useEffect(() => {
    if (roomId) {
      const fetchSeats = async () => {
        try {
          const response = await axios.get<FetchSeatsResponse>(`http://localhost:3000/api/rooms/${roomId}/seats`);
          setSeats(response.data.seats);
        } catch (error: any) {
          setMessage(`Error fetching seats: ${error.response?.data?.error || error.message}`);
        }
      };

      fetchSeats();
    }
  }, [roomId]);

  useEffect(() => {
    if (roomId) {
      const channel = supabase
        .channel('room-changes')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` },
          (payload) => {
            console.log('Change received!', payload);
            if (payload.new.status === 'drafting') {
              navigate('/draft', { state: { setName: payload.new.set_name, roomId } });
            }
          }
        )
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'room_players', filter: `room_id=eq.${roomId}` },
          (payload) => {
            console.log('Player joined!', payload);
            setSeats((prevSeats) => [...prevSeats, payload.new as Seat]);
          }
        )
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'room_players', filter: `room_id=eq.${roomId}` },
          (payload) => {
            console.log('Player updated!', payload);
            setSeats((prevSeats) =>
              prevSeats.map((seat) => (seat.id === payload.new.id ? payload.new as Seat : seat))
            );
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [roomId, navigate]);

  const botCount = seats.filter(seat => seat.is_bot).length;
  const userCount = seats.filter(seat => !seat.is_bot).length;

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

      {roomId && (
        <>
          <h2>Select Magic: The Gathering Set</h2>
          <select value={selectedSet} onChange={(e) => setSelectedSet(e.target.value)}>
            <option value="">Select a set</option>
            {sets.map(set => (
              <option key={set.code} value={set.code}>{set.name}</option>
            ))}
          </select>
          <button onClick={handleStartDraft} disabled={!selectedSet}>
            Start Draft
          </button>

          <h3>Room ID: {roomId}</h3>
          <p>Bots: {botCount}</p>
          <p>Users: {userCount}</p>
        </>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default Room;