// app/api/revalidate-home/route.js
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Revalidate the home page immediately
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      revalidated: true,
      message: "Home page revalidated successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to revalidate home page",
      },
      { status: 500 },
    );
  }
}

// Also allow GET so you can manually trigger it from the browser if needed
export async function GET(request) {
  try {
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      revalidated: true,
      message: "Home page revalidated successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to revalidate home page",
      },
      { status: 500 },
    );
  }
}
