{{/*
Expand the name of the chart.
*/}}
{{- define "devops-tools-hub.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "devops-tools-hub.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "devops-tools-hub.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "devops-tools-hub.labels" -}}
helm.sh/chart: {{ include "devops-tools-hub.chart" . }}
{{ include "devops-tools-hub.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- if .Values.previewEnvironment.enabled }}
preview.gitops/pr-number: {{ .Values.previewEnvironment.prNumber | quote }}
preview.gitops/branch: {{ .Values.previewEnvironment.branchName | replace "/" "-" | trunc 63 | quote }}
preview.gitops/managed-by: "argocd-applicationset"
{{- end }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "devops-tools-hub.selectorLabels" -}}
app.kubernetes.io/name: {{ include "devops-tools-hub.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "devops-tools-hub.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "devops-tools-hub.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}
