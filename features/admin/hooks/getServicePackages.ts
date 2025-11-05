"use client";
import { GetServicePackagesResponse } from "@/types/servicePackage/servicePackage";
import {  useQuery } from "@tanstack/react-query";
import { getServicePackages } from "../services/getServicePackages";

export const useGetServicePackages = () => {
  return useQuery<GetServicePackagesResponse, Error>({
    queryKey: ["getCoinServicePackages"],
    queryFn: () => getServicePackages(),
  });
};