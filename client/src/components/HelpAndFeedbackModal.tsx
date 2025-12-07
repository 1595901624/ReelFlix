import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";

export default function HelpAndFeedbackModal({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: () => void }) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">帮助与反馈</ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">免责声明</h3>
                  <p className="text-sm text-default-600">
                    ReelFlix 仅作为视频内容聚合平台，不对所展示内容的版权、合法性或准确性承担任何责任。用户应自行评估并承担使用风险。
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">广告警告</h3>
                  <p className="text-sm text-default-600">
                    请谨慎对待应用内外的广告信息。本平台不对广告内容的真实性或可靠性负责。
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">反馈</h3>
                  <p className="text-sm text-default-600">
                    如果您遇到任何问题或有建议，请通过 GitHub 反馈：<a href="https://github.com/1595901624/ReelFlix" target="_blank" rel="noopener noreferrer" className="text-primary">https://github.com/1595901624/ReelFlix</a>
                  </p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                关闭
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}