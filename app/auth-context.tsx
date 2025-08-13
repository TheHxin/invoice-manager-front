import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { SETTINGS } from "@/lib/settings";
import { User } from "lucide-react";

interface User {
  username: string;
  full_name: string;
  email: string;
}

interface AuthContextInterface {
  user: User | undefined;
  getToken: () => string;
  setToken: (token: string) => string;
  setUser: Dispatch<SetStateAction<User | undefined>>;
  isAuthed: () => boolean;
}

const AuthContext = createContext<AuthContextInterface | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const tokenRef = useRef("");
  const [user, setUser] = useState<User>();

  function isAuthed(): boolean {
    let res = true;

    axios
      .get(new URL("/me", SETTINGS.API_URL).toString(), {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .catch((e) => {
        if (e.status == 401) {
          res = false;
        } else {
          console.log(e);
        }
      });

    return res;
  }

  function getToken() {
    return tokenRef.current;
  }
  function setToken(token: string) {
    tokenRef.current = token;
    return tokenRef.current;
  }

  return (
    <AuthContext.Provider
      value={{ getToken, isAuthed, setToken, user, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider"); //note: the useAuth will work on components that are wrapped with the AuthPovider component.
  }
  return context;
}
