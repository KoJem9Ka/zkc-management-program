import { addressShort } from '@/util/helpers.ts';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownMenuProps, DropdownTrigger } from '@nextui-org/react';
import { Plus, Settings } from 'lucide-react';
import { useColored } from '@/hooks/useColored.ts';
import { useGetSubjectId } from '@/hooks/web3/useGetSubjectId.ts';
import { useDidStore } from '@/hooks/useDid.store.ts';
import { useDisconnect } from '@/hooks/web3/useDisconnect.ts';
import { useNavigate } from '@tanstack/react-router';

export const HeaderUserPanel = () => {
  const navigate = useNavigate();
  const { signOut } = useDisconnect();
  const { data: subject } = useGetSubjectId();
  const did = useDidStore(state => state.did);
  const settingsAction: DropdownMenuProps['onAction'] = async (key) => {
    if (key === 'logout') await signOut();
  };
  const [keyColor] = useColored(subject?.key);
  const [didColor] = useColored(did?.id);

  return (
    <>
      <div className="flex flex-col">
        <p style={{ color: keyColor }}>{subject?.type}{': '}{addressShort(subject?.key || '')}</p>
        <p style={{ color: didColor }}>{'DID: '}{addressShort(did?.id || '')}</p>
      </div>
      <Button onClick={() => navigate({ to: '/credential-issue' })} variant="light" radius="full" isIconOnly>
        <Plus className="text-foreground"/>
      </Button>
      <Dropdown>
        <DropdownTrigger>
          <Button variant="light" radius="full" isIconOnly><Settings className="text-foreground"/></Button>
        </DropdownTrigger>
        <DropdownMenu onAction={settingsAction}>
          <DropdownItem className="text-danger" color="danger" key="logout">Logout</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
};
