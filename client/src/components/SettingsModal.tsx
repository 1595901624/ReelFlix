import { useState } from 'react';
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Button, 
  Input, 
  Listbox, 
  ListboxItem,
  Chip
} from "@heroui/react";
import { useSettings } from '../context/SettingsContext';

interface SettingsModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export default function SettingsModal({ isOpen, onOpenChange }: SettingsModalProps) {
  const { sources, currentSourceIndex, addSource, removeSource, setCurrentSourceIndex } = useSettings();
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceUrl, setNewSourceUrl] = useState('');

  const handleAddSource = () => {
    if (newSourceName && newSourceUrl) {
      addSource({ name: newSourceName, url: newSourceUrl });
      setNewSourceName('');
      setNewSourceUrl('');
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">设置 - 数据源配置</ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">添加新源</h3>
                  <div className="flex gap-2 mb-2">
                    <Input 
                      label="名称" 
                      placeholder="例如: 官方源" 
                      value={newSourceName}
                      onValueChange={setNewSourceName}
                      size="sm"
                    />
                    <Input 
                      label="API 地址" 
                      placeholder="https://..." 
                      value={newSourceUrl}
                      onValueChange={setNewSourceUrl}
                      size="sm"
                    />
                  </div>
                  <Button color="primary" onPress={handleAddSource} isDisabled={!newSourceName || !newSourceUrl}>
                    添加
                  </Button>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">现有源列表</h3>
                  <p className="text-small text-default-500 mb-2">点击选择当前使用的源</p>
                  <div className="border rounded-lg overflow-hidden">
                    <Listbox 
                        aria-label="Sources"
                        onAction={(key) => setCurrentSourceIndex(Number(key))}
                        className="p-0"
                    >
                        {sources.map((source, index) => (
                            <ListboxItem 
                                key={index}
                                textValue={source.name}
                                endContent={
                                    <div className="flex items-center gap-2">
                                        {index === currentSourceIndex && <Chip color="success" size="sm" variant="flat">当前使用</Chip>}
                                        <Button 
                                            isIconOnly 
                                            size="sm" 
                                            color="danger" 
                                            variant="light" 
                                            onPress={() => removeSource(index)}
                                            isDisabled={sources.length <= 1}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </Button>
                                    </div>
                                }
                                description={source.url}
                                className={index === currentSourceIndex ? "bg-primary-50 dark:bg-primary-900/20" : ""}
                            >
                                {source.name}
                            </ListboxItem>
                        ))}
                    </Listbox>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                关闭
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
