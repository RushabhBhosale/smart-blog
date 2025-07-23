"use client";

export function DeleteButton({ id }: { id: string }) {
  async function deleteBlog() {
    await fetch(`/api/blog/${id}`, { method: "DELETE" });
    location.reload();
  }

  return (
    <button
      onClick={deleteBlog}
      className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition"
    >
      Delete
    </button>
  );
}
