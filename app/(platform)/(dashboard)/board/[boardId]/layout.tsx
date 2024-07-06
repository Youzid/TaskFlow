import { notFound, redirect } from "next/navigation";

import { db } from "@/lib/db";
import { BoardNavbar } from "./components/board-navbar";
import { auth } from "@clerk/nextjs/server";

export async function generateMetadata({
    params,
}: {
    params: { boardId: string };
}) {
    const { orgId } = auth();

    if (!orgId) {
        return {
            title: "Board",
        };
    }

    const board = await db.board.findUnique({
        where: {
            id: params.boardId,
            orgId,
        },
    });

    return {
        title: board?.title || "Board",
    };
}

const BoardIdLayout = async ({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { boardId: string };
}) => {
    const { orgId } = auth();

    if (!orgId) {
        redirect("/select-org");
    }

    const board = await db.board.findUnique({
        where: {
            id: params.boardId,
            orgId,
        },
    });

    if (!board) {
        notFound();
    }

    return (
        <div
            className="relative  h-full w-full "

        >
            <BoardNavbar data={board} />
            <div className="absolute inset-0 bg-black/10 " />
            <div style={{ backgroundImage: `url(${board.imageFullUrl})` }} className="h-full  bg-black top-0 left-0 w-full  absolute bg-no-repeat bg-cover bg-center  brightness-50" ></div>
            <main className="relative  pt-28 z-10 h-full backdrop-blur-md">{children}</main>
        </div>
    );
};

export default BoardIdLayout;
