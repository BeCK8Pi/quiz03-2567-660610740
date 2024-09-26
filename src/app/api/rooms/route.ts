import { DB, Payload, readDB, writeDB } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { dbinterface } from "@lib/DB";

export const GET = async () => {
  readDB();
  const rooms = (<dbinterface>DB).rooms;
  let totalRooms = 0;
  for(const r in rooms){
    totalRooms += 1;
    r;
  }
  return NextResponse.json({
    ok: true,
    rooms: rooms,
    totalRooms: totalRooms,
  });
};

export const POST = async (request: NextRequest) => {
  const payload = checkToken();

  if(!payload || !((<Payload>payload).role === "ADMIN" || (<Payload>payload).role === "SUPER_ADMIN")) return NextResponse.json(
     {
       ok: false,
       message: "Invalid token",
     },
     { status: 401 }
   );
   

  readDB();

  const body = await request.json();

  const sameRoom = (<dbinterface>DB).rooms.find((x) => x.roomName === body.roomName);

  if(sameRoom) return NextResponse.json(
     {
       ok: false,
       message: `Room ${body.roomName} already exists`,
     },
     { status: 400 }
   );

  const roomId = nanoid();
   const roomName = body.roomName;
  const newRoom = { roomId , roomName };

  //call writeDB after modifying Database
  (<dbinterface>DB).rooms.push(newRoom);
  writeDB();

  return NextResponse.json({
    ok: true,
    roomId: roomId,
    message: `Room ${body.roomName} has been created`,
  });
};
