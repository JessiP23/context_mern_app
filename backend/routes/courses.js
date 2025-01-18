/**
 * 
 * For courses routes is needed:
 * 1. Authenticated users
 * 2. Get all courses from AI
 * 3. Get all courses from user
 * 4. Select a course if any
 * 
 */

import express from 'express';
import { authenticate } from '../server';
import { User } from '../models/Course';
