import { HttpAgent } from "@ag-ui/client";
import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { NextRequest, NextResponse } from "next/server";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8008";
const agent = new HttpAgent({ url: `${backendUrl}/chat` });
const runtime = new CopilotRuntime({ agents: { consultant: agent } });

export async function POST(req: NextRequest) {
  try {
    const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
      runtime,
      serviceAdapter: new ExperimentalEmptyAdapter(),
      endpoint: "/api/copilotkit",
    });
    return handleRequest(req);
  } catch (error) {
    console.error("CopilotKit route error:", error);
    return NextResponse.json(
      { error: "Failed to connect to the backend. Is the server running on port 8008?" },
      { status: 502 }
    );
  }
}
