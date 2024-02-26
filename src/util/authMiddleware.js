import { auth } from "@/lib/firebase";
import { signInWithCredential } from "firebase/auth";

export const authMiddleware = async (context) => {
    const { req, res} = context;
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader || !cookieHeader.includes('user')) {
        res.writeHead(302, { Location: '/login' });
        res.end();
        return { props: {} };
      }
      return {props: {token: cookieHeader.split("=")[1]}}
}