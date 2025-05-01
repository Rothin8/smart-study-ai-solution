
import { Button } from "@/components/ui/button";
import { useChat } from "@/contexts/ChatContext";

type ClassOption = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type BoardOption = "SEBA" | "CBSE" | "AHSEC";

const ClassBoardSelector = () => {
  const { selectedClass, selectedBoard, selectClass, selectBoard } = useChat();

  const classes: ClassOption[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  
  const getBoardOptions = (classNum: ClassOption | null): BoardOption[] => {
    if (!classNum) return [];
    if (classNum <= 10) {
      return ["SEBA", "CBSE"];
    } else {
      return ["AHSEC", "CBSE"];
    }
  };

  const boards = selectedClass ? getBoardOptions(selectedClass) : [];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-sm font-medium mb-3">Select your class and board</h3>
      
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2">Class</p>
        <div className="grid grid-cols-4 gap-1">
          {classes.map((classNum) => (
            <Button
              key={classNum}
              variant={selectedClass === classNum ? "default" : "outline"}
              className={`text-xs py-1 px-2 h-8 ${selectedClass === classNum ? "bg-chatbot hover:bg-chatbot/90" : ""}`}
              onClick={() => selectClass(classNum)}
            >
              {classNum}
            </Button>
          ))}
        </div>
      </div>
      
      {selectedClass && (
        <div>
          <p className="text-xs text-gray-500 mb-2">Board</p>
          <div className="flex flex-col gap-1">
            {boards.map((board) => (
              <Button
                key={board}
                variant={selectedBoard === board ? "default" : "outline"}
                className={`text-xs py-1 h-8 ${selectedBoard === board ? "bg-chatbot hover:bg-chatbot/90" : ""}`}
                onClick={() => selectBoard(board)}
              >
                {board}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassBoardSelector;
