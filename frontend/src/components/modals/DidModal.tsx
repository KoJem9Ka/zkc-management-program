import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { useDidStore } from '@/hooks/useDid.store.ts';
import { toast } from 'sonner';
import { useSignMessage } from '@/hooks/web3/useSignMessage.ts';
import { AuroErrorCodeEnum } from '@/service/auro.ts';
import { type FC } from 'react';
import { useDisconnect } from '@/hooks/web3/useDisconnect.ts';
import { RequireWalletHoc } from '@/components/HOC/RequireWalletHoc.tsx';
import { useWalletStore } from '@/hooks/web3/useWallet.store.ts';
import { IconByWalletType } from '@/components/icons.tsx';
import { addressShort } from '@/util/helpers.ts';

// TODO: Need to think about signMessageText, and pass it to WalletAdapter.sign entirely
const messageText = 'WARNING! Make sure you are on zcred.org domain. If not, you are being phished!';

export const DidModal: FC = () => {
  const authenticate = useDidStore(state => state.authenticate);
  const address = useWalletStore(state => state.address)!;
  const walletType = useWalletStore(state => state.type)!;
  const { signOut } = useDisconnect();

  const onConfirm = () => signMessage({ message: messageText });
  const onCancel = () => signOut();

  const { mutate: signMessage, isPending } = useSignMessage({
    onSuccess: signature => authenticate(signature, address!),
    onError: async (error) => {
      const isUserRejected = error.name === 'UserRejectedRequestError'
        || 'code' in error && error.code === AuroErrorCodeEnum.UserRejectedRequest;
      if (isUserRejected) {
        toast.warning('Sign in canceled. You need to sign the message to continue.');
      } else {
        toast.error(`Unexpected error "${error}": ${error instanceof Error ? error.message : error}`);
      }
      await onCancel();
    },
  });

  return (
    <RequireWalletHoc>
      <Modal isOpen backdrop="blur" onClose={onCancel} placement="center">
        <ModalContent>
          <ModalHeader>
            Sign In
          </ModalHeader>
          <ModalBody>
            <p>Sign the message to prove you own this wallet and proceed. Canceling will disconnect you.</p>
            <br/>
            <p>{messageText}</p>
          </ModalBody>
          <ModalFooter className="flex">
            <span className="flex items-center gap-2">
              <IconByWalletType type={walletType} className="w-7 h-7"/>
              {` `}
              {addressShort(address)}
            </span>
            <div className="grow"/>
            <Button
              onClick={onCancel}
              variant="light"
              color="danger"
              isDisabled={isPending}
            >Disconnect</Button>
            <Button
              disabled={!address}
              onClick={onConfirm}
              color="success"
              isLoading={isPending}
            >Continue</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </RequireWalletHoc>
  );
};
