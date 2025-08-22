import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import NetInfo from '@react-native-community/netinfo';

interface NetworkContextProps {
  isConnected: boolean;
}

const NetworkContext = createContext<NetworkContextProps>({
  isConnected: true,
});

export const NetworkProvider: React.FC<{children: ReactNode}> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? true);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <NetworkContext.Provider value={{isConnected}}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => useContext(NetworkContext);
