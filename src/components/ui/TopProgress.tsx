import { useEffect, useRef } from 'react';
import LoadingBar from 'react-top-loading-bar';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { useNavigation } from 'react-router';

type LoadingBarHandle = {
  continuousStart: () => void;
  complete: () => void;
};

export default function TopProgress() {
  const ref = useRef<LoadingBarHandle | null>(null);

  const fetching = useIsFetching();
  const mutating = useIsMutating();
  const navigation = useNavigation();

  const busy = navigation.state !== 'idle' || fetching > 0 || mutating > 0;

  useEffect(() => {
    if (busy) {
      ref.current?.continuousStart();
    } else {
      ref.current?.complete();
    }
  }, [busy]);

  return <LoadingBar ref={ref} height={3} color="#2563eb" shadow={true} containerStyle={{ zIndex: 9999 }} />;
}
