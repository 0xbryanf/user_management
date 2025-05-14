import { NextResponse } from "next/server";
import api from "./api";

export const fetchAuthorization = async (
  sessionToken: string,
  token: string
): Promise<Response | void> => {
  try {
    const { data } = await api.post(
      `${process.env.BASE_URL}/get-authorization`,
      { key: sessionToken },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (data?.status != 200) {
      return NextResponse.json(
        { error: "Invalid Credentials." },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error: Failed to fetch authorization." },
      { status: 500 }
    );
  }
};
