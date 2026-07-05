import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Alert from "@/models/Alert";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    await Alert.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}