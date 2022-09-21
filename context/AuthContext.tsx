import {
    createContext,
    FC,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';
import { auth, db } from '../config/firebase';
import { getDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';
import {
    AuthError,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';

export interface User {
    activated: boolean;
    email: string;
    admin: boolean;
    graduationYear: number | string;
    name: string;
    uid: string;
    phoneNumber: string;
    studentId: string | number;
    transcript?: string;
}

interface ContextValue {
    user: User;
    login: (email: string, password: string) => any;
    logout: () => any;
    signup: (
        email: string,
        password: string,
        name: string,
        phoneNumber: string,
        studentId: string,
        graduationYear: number | string,
        catchErr: (error: AuthError) => any,
    ) => any;
}

const AuthContext = createContext<ContextValue>({
    user: {
        activated: false,
        email: '',
        admin: false,
        graduationYear: 0,
        name: '',
        uid: '',
        phoneNumber: '',
        studentId: '',
    },
    login: (email: string, password: string) => {},
    logout: () => {},
    signup: (
        email: string,
        password: string,
        name: string,
        phoneNumber: string,
        studentId: string,
        graduationYear: number | string,
        catchErr: (error: AuthError) => any,
    ) => {},
});

const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
    children: ReactNode;
}
const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User>({
        activated: false,
        email: '',
        admin: false,
        graduationYear: 0,
        name: '',
        uid: '',
        phoneNumber: '',
        studentId: '',
    });
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            const uid = user?.uid;

            if (uid) {
                const docRef = doc(db, 'users', uid);
                getDoc(docRef).then((doc) => {
                    const data: any = doc.data();
                    setUser({
                        ...data,
                        uid,
                    });
                    setLoading(false);
                });
            } else {
                setUser({
                    activated: false,
                    email: '',
                    admin: false,
                    graduationYear: 0,
                    name: '',
                    uid: '',
                    phoneNumber: '',
                    studentId: '',
                });
                setLoading(false);
            }
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        if (user.uid) {
            const unsubscribe = onSnapshot(
                doc(db, 'users', user.uid),
                (doc) => {
                    const data: any = doc.data();
                    setUser({
                        ...data,
                        uid: user.uid,
                    });
                },
            );
            return unsubscribe;
        }
    }, [user.uid]);

    const signup = async (
        email: string,
        password: string,
        name: string,
        phoneNumber: string,
        studentId: string,
        graduationYear: number | string,
        catchErr: (error: AuthError) => any,
    ) => {
        try {
            const userCred = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
            );
            if (userCred && userCred.user && userCred.user.uid) {
                const docRef = doc(db, 'users', userCred.user.uid);
                setDoc(docRef, {
                    email,
                    admin: false,
                    activated: false,
                    graduationYear,
                    name,
                    phoneNumber,
                    studentId,
                    uid: userCred.user.uid,
                });
                return true;
            } else return false;
        } catch (error) {
            if (catchErr) {
                catchErr(error as any);
            }
            return false;
        }
    };

    const login = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        signOut(auth);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                signup,
                login,
                logout,
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

export { useAuth, AuthProvider };
