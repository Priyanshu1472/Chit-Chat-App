import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const { authUser } = useAuthContext();

	useEffect(() => {
	let socketInstance;

	if (authUser) {
		socketInstance = io("http://localhost:5000", {
			query: { userId: authUser._id },
		});

		setSocket(socketInstance);

		socketInstance.on("getOnlineUsers", (users) => {
			setOnlineUsers(users);
		});
	} else {
		if (socket) {
			socket.close();
			setSocket(null);
		}
	}

	// Cleanup: make sure socket is closed when component unmounts or user logs out
	return () => {
		if (socketInstance) {
			socketInstance.close();
		}
	};
}, [authUser]);


	return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};
