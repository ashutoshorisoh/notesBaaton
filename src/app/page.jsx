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
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  const handleAdd = async () => {
    try {
      const roomData = { roomname, password };

      // Sending POST request to the API
      const res = await axios.post("/api/roomlogin", roomData);
      setLoading(true)
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
    <div className="flex justify-center items-center min-h-screen back">
      <Card className="lg:w-[350px] w-[250px]">
        <CardHeader>
          <CardTitle>Create Room</CardTitle>
          <CardDescription>Enter the details to create/join a room.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center lg:gap-4 gap-2">
            <div className="flex flex-col lg:space-y-1.5 space-y-1">
              <Label htmlFor="roomname">Room Name</Label>
              <Input
                id="roomname"
                type="text"
                placeholder="Enter room name"
                value={roomname}
                onChange={(e) => setRoomname(e.target.value)}
              />
            </div>
            <div className="flex flex-col lg:space-y-1.5 space-y-1">
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
        <CardFooter className="flex justify-end lg:space-x-2 space-x-1.5">
          <Button
            variant="outline"
            onClick={() => {
              setRoomname("");
              setPassword("");
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleAdd}>{loading? "wait..": "join/create room"}</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
