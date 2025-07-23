"use client";

import Link from "next/link";

export function EditButton({ id }: { id: string }) {
  return (
    <Link
      href={`/blog/add/${id}`}
      className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition"
    >
      Edit
    </Link>
  );
}
