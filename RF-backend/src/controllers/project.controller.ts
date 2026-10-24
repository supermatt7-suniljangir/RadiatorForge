import { NextFunction, Request, Response } from "express";
import logger from "../config/logger";
import CloudinaryService from "../services/CloudinaryService";
import ProjectService from "../services/ProjectService";
import { ProjectDocument, ProjectType } from "../types/project";
import { AppError, success } from "../utils/responseTypes";

class ProjectController {
  // Create a new project
  static async createProject(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?._id;
      if (!userId) {
        next(new AppError("User not authenticated", 401));
        return;
      }

      const project = await ProjectService.createProject(userId, req.body);

      res
        .status(201)
        .json(success({ data: project, message: "Project created" }));
    } catch (error: any) {
      logger.error("Error creating project", error);
      if (error.code === 11000) {
        next(new AppError("A project with this slug already exists", 400));
        return;
      }

      next(new AppError("Error creating project", 500));
    }
  }

  // Update a project
  static async updateProject(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const projectId = req.params.id;
      if (!projectId) {
        next(new AppError("Project ID is required", 400));
        return;
      }

      const userId = req.user?._id;
      if (!userId) {
        next(new AppError("User not authenticated", 401));
        return;
      }

      const project = await ProjectService.updateProject(projectId, req.body);

      res
        .status(200)
        .json(success({ data: project, message: "Project updated" }));
    } catch (error: any) {
      logger.error(`Error updating project: ${error.message}`);
      next(new AppError("Error updating project", 500));
    }
  }

  // Get a project by ID
  static async getProjectById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const projectId = req.params.id;
      if (!projectId) {
        next(new AppError("Project ID is required", 400));
        return;
      }

      const project = await ProjectService.getProjectById(projectId);
      res
        .status(200)
        .json(success({ data: project, message: "Project fetched" }));
    } catch (error: any) {
      logger.error(`Error fetching project: ${error.message}`);
      const status = error.statusCode || 500;
      next(new AppError(error.message || "Unable to fetch project", status));
    }
  }

  // Get all published projects
  static async getProjects(
    _: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const projects = await ProjectService.getPublishedProjects();

      res.status(200).json(
        success({
          data: projects,
          message: `${projects.length} projects fetched`,
        }),
      );
    } catch (error: any) {
      logger.error(`Error fetching projects: ${error.message}`);
      next(new AppError("Failed to fetch projects", 500));
    }
  }

  // Get projects by a user
  static async getProjectsByUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId: paramUserId } = req.params;
      const user = req.user;
      if ((!user || !user._id) && paramUserId === "personal") {
        next(new AppError("User not authenticated", 401));
        return;
      }

      const targetUserId =
        paramUserId === "personal" ? user!._id?.toString() : paramUserId;

      if (!targetUserId) {
        next(new AppError("User ID is required", 400));
        return;
      }
      const isOwnProfile = user?._id?.toString() === targetUserId;

      const projects = await ProjectService.getProjectsByUser(
        targetUserId,
        isOwnProfile,
      );

      res.status(200).json(
        success({
          data: projects,
          message: "User projects fetched successfully",
        }),
      );
    } catch (error: any) {
      logger.error(`Error fetching user projects: ${error.message}`);
      next(new AppError("Error fetching user projects", 500));
    }
  }

  static async deleteProject(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?._id;
      if (!userId) {
        next(new AppError("User not authenticated", 401));
        return;
      }
      const { id } = req.params;
      if (!id) {
        next(new AppError("Project ID is required", 400));
        return;
      }
      // Find the project first to check ownership
      const project: Partial<ProjectType> =
        await ProjectService.getProjectById(id);
      if (!project) {
        next(new AppError("Project not found", 404));
        return;
      }
      const creatorId =
        (project.creator as any)._id || (project.creator as any).id;
      if (creatorId.toString() !== userId.toString()) {
        // Access denied
        next(
          new AppError("You are not authorized to delete this project", 403),
        );
        return;
      }

      //first delete all the media files associated with the project
      /*
      Watch out for Duplicates here, thumbnail can also be same as one of the media files, while cloudinary handles dupcliates gracefully, if you ever consider a migration, make sure to check whether the publicIds contains no dupcliates, can be done by converting the array to a set first.
    
      const publicIds = Array.from(
  new Set([
    project.thumbnail?.key,
    ...(project.media?.map((item) => item.key) || []),
  ].filter(Boolean))
) as string[];
      */
      const publicIds: string[] = [
        project.thumbnail?.key,
        ...(project.media?.map((item) => item.key) || []),
      ].filter(Boolean) as string[];
      await CloudinaryService.deleteFiles(publicIds as string[]);
      // Delete the project
      await ProjectService.deleteProject(id);

      res
        .status(200)
        .json(success({ message: "Project deleted successfully", data: true }));
    } catch (error: any) {
      logger.error(`Error deleting project: ${error.message}`);
      next(new AppError("Error deleting project", 500));
    }
  }
}

export default ProjectController;
