"use client";
import { GetServicePackagesResponse } from "@/types/servicePackage/servicePackage";
import {  useQuery } from "@tanstack/react-query";
import { getServicePackages } from "../services/getServicePackages";

export const useGetServicePackages = (
  pageNumber: string = "1",
  pageSize: string = "10",
  search: string = "",
  filter: string = ""
) => {
  return useQuery<GetServicePackagesResponse, Error>({
    queryKey: ["getServicePackages", pageNumber, pageSize, search, filter],
    queryFn: () => getServicePackages(pageNumber, pageSize, search, filter),
  });
};