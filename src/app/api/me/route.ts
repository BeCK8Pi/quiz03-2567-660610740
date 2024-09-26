import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Kritsaran Khuntip",
    studentId: "660610740",
  });
};
