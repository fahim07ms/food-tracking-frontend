"use client";

import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function FloatingChatButton() {
    const router = useRouter();

    return (
        <Button
            size="icon"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
            onClick={() => router.push("/chat")}
            aria-label="Open chat"
        >
            <MessageCircle className="h-6 w-6" />
        </Button>
    );
}
