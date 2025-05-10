import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

const MachineCard = ({ machine, isSelected, onSelect }) => (
    <Card className={`relative mx-auto max-w-lg h-[22rem] bg-[#5b2333] bg-opacity-90 text-white shadow-xl rounded-2xl overflow-hidden transition-all ${
      isSelected 
        ? "border-2 border-[#ff4d4d] scale-[1.02] shadow-[0_0_25px_rgba(255,75,75,0.7)]"
        : "border border-[#d49c79]/30 hover:scale-[1.01] hover:shadow-[0_0_15px_rgba(255,75,75,0.5)]"
    }`}>
      <div className="absolute inset-0 rounded-2xl opacity-60 bg-[url('/assets/service3.png')] bg-cover bg-center backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-b from-red-300/20 via-transparent to-[#2a0d12]/80 rounded-2xl"></div>
        <div className="absolute inset-0 border-2 border-transparent rounded-2xl animate-borderGlow"></div>
      </div>
  
      <div className="relative z-10 flex flex-col justify-between h-full p-6">
        <CardHeader className="p-0">
          <CardTitle className="text-3xl font-extrabold tracking-wide text-white drop-shadow-md">
            {machine.name}
          </CardTitle>
        </CardHeader>
  
        <CardContent className="grid grid-cols-2 gap-4 p-0 my-4">
          <SpecItem icon="💻" label="CPU" value={`${machine.cpu} Cores`} />
          <SpecItem icon="💾" label="RAM" value={`${machine.ram} GB`} />
          <SpecItem icon="🗄️" label="Storage" value={`${machine.storage} GB`} />
          <SpecItem icon="👤" label="Owner" value={machine.userName} />
        </CardContent>
  
        <div className="flex gap-3">
          <Button 
            onClick={onSelect}
            className={`flex-1 py-6 text-lg font-bold transition-all ${
              isSelected
                ? "bg-[#25d366] hover:bg-[#1da851]"
                : "bg-[#ff4d4d] hover:bg-[#cc3838]"
            }`}
          >
            {isSelected ? "✓ Selected" : "⚡ Select Machine"}
          </Button>
        </div>
      </div>
    </Card>
  );

  const SpecItem = ({ icon, label, value }) => (
    <div className="flex items-center space-x-3 p-3 bg-[#5b2333]/50 rounded-lg">
      <span className="text-xl">{icon}</span>
      <div>
        <div className="font-semibold text-sm text-[#d49c79]">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );

  export default MachineCard;