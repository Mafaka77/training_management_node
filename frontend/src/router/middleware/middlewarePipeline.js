export default function middlewarePipeline(context, middleware, index) {
    const nextMiddleware = middleware[index];

    // If there is no more middleware to run, use the original router 'next'
    if (!nextMiddleware) {
        return context.next;
    }

    return (...parameters) => {
        // If a middleware calls next({ name: 'login' }), it has parameters.
        // We stop the pipeline and let the router handle the redirect.
        if (parameters.length > 0) {
            context.next(...parameters);
            return;
        }

        // Prepare the next step in the chain
        const nextPipeline = middlewarePipeline(
            context,
            middleware,
            index + 1
        );

        // Run the next middleware in the array
        nextMiddleware({ ...context, next: nextPipeline });
    };
}