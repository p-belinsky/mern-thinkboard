import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
    try {
        const ip =
            req.headers["x-forwarded-for"]?.split(",")[0] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            "anonymous";

        const { success } = await ratelimit.limit(ip);

        if (!success) {
            return res.status(429).json({
                message: "Too many requests, please try again later",
            });
        }

        next();
    } catch (error) {
        console.error("Rate limit error", error);
        next(error);
    }
};

export default rateLimiter;
