export const NotFoundPage = () => {
  return (
    <main className="grid place-content-center min-h-screen">
      <div className="max-w-xl flex flex-col gap-4">
        <h1 className="text-5xl font-extralight text-slate-950">
          404 | Page not found
        </h1>
        <div className="space-y-2">
          <p className="text-sm leading-6 text-slate-600">
            This route is not implemented yet :)
          </p>
        </div>
      </div>
    </main>
  );
};
