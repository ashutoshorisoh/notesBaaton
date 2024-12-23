"use client";
import axios from "axios";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function Home() {
  const [roomname, setRoomname] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleAdd = async () => {
    try {
      const roomData = { roomname, password };

      // Sending POST request to the API
      const res = await axios.post("/api/roomlogin", roomData);

      // Extract the user ID from the response
      const { userId } = res.data;

      console.log("Room added successfully:", res.data);

      // Clear fields after successful submission
      setRoomname("");
      setPassword("");

      // Navigate to the dynamic route
      router.push(`/room/${userId}`);
    } catch (error) {
      console.error("Error during room creation:", error.response?.data || error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Create Room</CardTitle>
          <CardDescription>Enter the details to create/join a room.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="roomname">Room Name</Label>
              <Input
                id="roomname"
                type="text"
                placeholder="Enter room name"
                value={roomname}
                onChange={(e) => setRoomname(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              setRoomname("");
              setPassword("");
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleAdd}>Add Room</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
