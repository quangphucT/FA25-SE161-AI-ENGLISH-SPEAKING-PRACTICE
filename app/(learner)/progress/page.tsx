import { Card } from "@/components/ui/card";

interface ProgressProps {
  setActiveMenu?: (menu: string) => void;
}
const Progress = ({ setActiveMenu }: ProgressProps) => {
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900">📊 Tiến độ học tập</h3>
        <p className="text-gray-500 mt-1">
          Theo dõi kết quả và tiến độ học tập của bạn
        </p>
      </div>

      <Card className="p-6">
        <h4 className="text-lg font-bold text-gray-900 mb-4">
          Đang phát triển...
        </h4>
        <p className="text-gray-600">Tính năng này sẽ sớm được cập nhật.</p>
      </Card>
    </div>
  );
};

export default Progress;
