import { useState } from "react";
import { Button } from "../../ui/button";
// import { Input } from '@/components/ui/input';
// import axios from 'axios';
// import { PinataSDK } from "pinata";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
// import { useWallet } from '@aptos-labs/wallet-adapter-react';



const ComputeCard = ({ machine }) => {
  const [model, setModel] = useState(null);
  const [ds, setDs] = useState(null);
  const [req, setReq] = useState(null);
  const [dis, setDis] = useState(true);
  const [cid, setCid] = useState(null); // Store the CID here
  const [amount, setAmount] = useState(0.1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  //   const pinata = new PinataSDK({
  //     pinataJwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2MDM4MjNhNS0zMDYzLTRiN2EtYjAzMC04ZjEyODhhYjc2YjYiLCJlbWFpbCI6ImhlbWlsZHVkaGF0MDRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImE4MDBmMDg5OThmNDFlMWI0ZjE0Iiwic2NvcGVkS2V5U2VjcmV0IjoiYzYzMWM5OGI3NmY4MzAxZWQxNmYyNmJlZjczMjc2ZDQwNDEwOWU0ZmM0OWFhMzM0M2I3NjU1ZTllODJjZjA5NiIsImV4cCI6MTc2OTM3NTI3NH0.7jZORIMMPHSTHR0VumTtS7eiAi4NPdhGkmi2P42EWFM",
  //     pinataGateway: "https://api.pinata.cloud/pinning/pinFileToIPFS",
  // });
  // const { account } = useWallet();
  // Show toast
  // Function to upload files to your Next.js API route and get CID
  const handleFileUpload = async () => {
    const formData = new FormData();
    if (model) formData.append("file", model);
    if (ds) formData.append("file", ds);
    if (req) formData.append("file", req);

    try {
      // Upload the file to Pinata using Pinata SDK
      const modelResponse = await pinata.upload.file(model);
      console.log(modelResponse);
      const modelcid = modelResponse.cid;
      const dsResponse = await pinata.upload.file(ds);
      const dscid = dsResponse.cid;
      const reqResponse = await pinata.upload.file(req);
      const reqcid = reqResponse.cid;

      console.log(modelcid, dscid, reqcid, machine._id, account?.address);
      const response = await axios.post(
        "http://localhost:4000/api/transactions",
        {
          modelLink: modelcid,
          datasetLink: dscid,
          requirementsLink: reqcid,
          machineId: machine._id,
          senderAddress: account?.address,
          amount: amount,
        }
      );
      console.log(response);
      if (response.status === 201) {
        setIsDialogOpen(false); // Close the dialog
      }

      // Get the CID (IPFS hash) from the response

      // Example of making another API request using the CID (optional)
    } catch (error) {
      console.error("Error uploading file to Pinata:", error);
    }
  };

  return (
    <div className="offsetstyle p-4 border gap-2 border-black rounded-md bg-green-300">
      <div className="grid gap-4">
        <h3 className="text-2xl font-semibold text-gray-700">{machine.name}</h3>{" "}
        {/* Display the machine's name or title */}
        <div className="text-gray-500 mt-2">
          {/* Time Remaining */}
          <div className="text-sm">
            <strong>Time Remaining:</strong> {machine.time}
          </div>

          {/* RAM */}
          <div className="text-sm">
            <strong>RAM:</strong> {machine.ram} GB
          </div>

          {/* CPU */}
          <div className="text-sm">
            <strong>CPU:</strong> {machine.cpu} cores
          </div>

          {/* Size */}
          <div className="text-sm">
            <strong>Size:</strong> {machine.size}
          </div>
        </div>
      </div>

      <div className="pt-2">
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => setIsDialogOpen(open)}
        >
          <DialogTrigger className="generalBorder flex items-center gap-2 w-full offsetstyle bg-white justify-center">
            Launch
          </DialogTrigger>
          <DialogContent className="bg-white offsetEffect generalBorder">
            <DialogHeader>
              <DialogTitle>Launch machine</DialogTitle>
              <DialogDescription>
                Add your files to start working!
              </DialogDescription>
            </DialogHeader>
            <div>
              {/* Form to upload files */}
              <div className="flex flex-col gap-2 py-4 text-sm">
                <span>Upload the following files to get started</span>
                <div>
                  <span>Model file (model.py)</span>
                  <input
                    type="file"
                    onChange={(e) =>
                      setModel(e.target.files ? e.target.files[0] : null)
                    }
                  />
                </div>
                <div>
                  <span>Dataset (dataset.csv)</span>
                  <input
                    type="file"
                    onChange={(e) =>
                      setDs(e.target.files ? e.target.files[0] : null)
                    }
                  />
                </div>
                <div>
                  <span>Requirements (requirements.txt)</span>
                  <input
                    type="file"
                    onChange={(e) =>
                      setReq(e.target.files ? e.target.files[0] : null)
                    }
                  />
                </div>
                <div>
                  <span>Token Fee</span>
                  <input onChange={(e) => setAmount(e.target.value)} />
                </div>
                <Button onClick={handleFileUpload}>Start</Button>
                <Button disabled={dis}>
                  <a href="/src/contractor.py">Download contractor</a>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ComputeCard;
