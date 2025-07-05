"use client"

import * as React from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Avatar,
  AvatarFallback,
  
} from "@/components/ui/avatar"
import {
  CalendarIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
  PlusIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
  ClockIcon,
  
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface Project {
  id: string
  name: string
  description: string
  progress: number
  status: "on-track" | "delayed" | "at-risk" | "completed"
  team: string[]
  dueDate: string
}

interface ProjectTrackingProps {
  projects: Project[]
  className?: string
}

export function ProjectTracking({ projects, className }: ProjectTrackingProps) {
  const getStatusDetails = (status: Project["status"]) => {
    switch (status) {
      case "on-track":
        return { color: "bg-green-500", icon: <CheckCircle2Icon className="h-4 w-4 text-green-500" />, label: "On Track" }
      case "delayed":
        return { color: "bg-red-500", icon: <AlertCircleIcon className="h-4 w-4 text-red-500" />, label: "Delayed" }
      case "at-risk":
        return { color: "bg-yellow-500", icon: <ClockIcon className="h-4 w-4 text-yellow-500" />, label: "At Risk" }
      case "completed":
        return { color: "bg-blue-500", icon: <CheckCircle2Icon className="h-4 w-4 text-blue-500" />, label: "Completed" }
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Project Tracking</CardTitle>
            <p className="text-sm text-muted-foreground">Active projects and their current status</p>
          </div>
          <Button className="gap-1 px-2 py-1 text-sm">
  <PlusIcon className="h-4 w-4" />
  New Project
</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => {
            const status = getStatusDetails(project.status)
            
            return (
              <div 
                key={project.id} 
                className="group relative border rounded-xl p-4 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {status.icon}
                    <h3 className="font-medium">{project.name}</h3>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="text-muted-foreground hover:text-foreground">
                      <MoreHorizontalIcon className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit Project</DropdownMenuItem>
                      <DropdownMenuItem>Archive Project</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">Delete Project</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {project.description}
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className={`font-medium ${project.progress === 100 ? "text-green-500" : ""}`}>
                      {project.progress}%
                    </span>
                  </div>
                  <Progress 
                    value={project.progress} 
                    className="h-2"
                  />
                  {project.progress === 100 && (
                    <p className="text-xs text-green-500">Project Completed</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {project.team.map((member, index) => (
                      <Avatar key={index} className="border-2 border-background hover:z-10 hover:scale-110 transition-transform">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {member.substring(0,2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    <Avatar className="border-2 border-background">
                      <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                        <PlusIcon className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{project.dueDate}</span>
                  </div>
                </div>

                <div className="absolute top-2 right-2">
                  <span className={`inline-block h-2 w-2 rounded-full ${status.color}`} />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-3">
        <Button className="text-primary gap-1 bg-transparent hover:bg-gray-100 shadow-none">
  View All Projects
  <ChevronRightIcon className="h-4 w-4" />
</Button>
      </CardFooter>
    </Card>
  )
}