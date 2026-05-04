#!/bin/bash

# Configuration
BACKEND_DIR="backend"
FRONTEND_DIR="frontend"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

VERBOSE=false

# Spinner animation function
spinner() {
    local pid=$1
    local delay=0.1
    local spinstr='|/-\'
    while [ "$(ps -p "$pid" -o pid=)" ]; do
        local temp=${spinstr#?}
        printf " [%c]  " "$spinstr"
        local spinstr=$temp${spinstr%"$temp"}
        sleep $delay
        printf "\b\b\b\b\b\b"
    done
    printf "    \b\b\b\b"
}

# Cleanup on exit
cleanup() {
    # Kill any background jobs if they exist
    jobs -p | xargs kill 2>/dev/null
    # Reset cursor and formatting if needed
    printf "${NC}"
}
trap cleanup EXIT

# Simple argument parsing
while [[ "$#" -gt 0 ]]; do
    case $1 in
        -v|--verbose) VERBOSE=true ;;
    esac
    shift
done

# Helper function to run a command and check its output
run_command() {
    local dir=$1
    local cmd=$2
    local description=$3

    if [ "$VERBOSE" = true ]; then
        printf "Running %b%s%b in %s...\n" "${GREEN}" "$description" "${NC}" "$dir"
    else
        printf "Running %s... " "$description"
    fi

    # Save current directory to return later
    local initial_dir=$(pwd)
    cd "$dir" || { printf "${RED}Failed to enter directory %s${NC}\n" "$dir"; exit 1; }
    
    if [ "$VERBOSE" = true ]; then
        if bash -c "$cmd"; then
            printf "${GREEN}✓ %s passed${NC}\n\n" "$description"
        else
            printf "${RED}✗ %s failed${NC}\n" "$description"
            exit 1
        fi
    else
        # Summary mode: run in background and show spinner
        bash -c "$cmd" > /dev/null 2>&1 &
        local pid=$!
        spinner $pid
        wait $pid
        local exit_code=$?

        if [ $exit_code -eq 0 ]; then
            printf "${GREEN}✓ passed${NC}\n"
        else
            printf "${RED}✗ failed${NC}\n"
            printf "Tip: Run with -v to see detailed errors.\n"
            exit 1
        fi
    fi
    cd "$initial_dir" || exit 1
}

# Function to run tests and extract summary
run_tests_with_summary() {
    local dir=$1
    local cmd=$2
    local description=$3
    local coverage_pattern=$4

    printf "Running %s... " "$description"

    local initial_dir=$(pwd)
    cd "$dir" || { printf "${RED}Failed to enter directory %s${NC}\n" "$dir"; exit 1; }
    
    # Capture test output
    local output
    output=$(bash -c "$cmd" 2>&1)
    local exit_code=$?
    
    cd "$initial_dir" || exit 1
    
    if [ $exit_code -eq 0 ]; then
        printf "${GREEN}✓ passed${NC}\n"
    else
        printf "${RED}✗ failed${NC}\n"
        if [ "$VERBOSE" = true ]; then
            echo "$output"
        else
            printf "Tip: Run with -v to see detailed errors.\n"
        fi
        exit 1
    fi
    
    # Extract test counts
    local tests_passed=""
    local tests_total=""
    local coverage=""
    
    if [[ "$dir" == "backend" ]]; then
        # Jest format: "Tests:       X passed, Y total"
        tests_passed=$(echo "$output" | grep -oE "Tests:.*[0-9]+ passed" | grep -oE "[0-9]+" | head -1)
        tests_total=$(echo "$output" | grep -oE "Tests:.*[0-9]+ total" | grep -oE "[0-9]+" | tail -1)
        # Jest coverage: "All files | XX.XX |"
        coverage=$(echo "$output" | grep "All files" | awk '{print $4}' | head -1)
    else
        # Vitest format: "Tests  X passed (X)"
        # Strip ANSI escape codes first (vitest 4+ wraps output in color codes)
        local clean_output
        clean_output=$(echo "$output" | sed 's/\x1b\[[0-9;]*m//g')
        tests_passed=$(echo "$clean_output" | grep -E "^\s+Tests\s+" | grep -oE "[0-9]+ passed" | grep -oE "[0-9]+")
        tests_total=$(echo "$clean_output" | grep -E "^\s+Tests\s+" | grep -oE "\([0-9]+\)" | grep -oE "[0-9]+")
        # Vitest coverage: "All files | XX.XX |"
        coverage=$(echo "$clean_output" | grep "All files" | awk -F'|' '{print $2}' | tr -d ' ')
    fi
    
    # Display summary
    if [ -n "$tests_passed" ] && [ -n "$tests_total" ]; then
        printf "   ${CYAN}Tests: ${BOLD}%s/%s passed${NC}" "$tests_passed" "$tests_total"
    fi
    if [ -n "$coverage" ]; then
        printf " ${CYAN}| Coverage: ${BOLD}%s%%${NC}" "$coverage"
    fi
    if [ -n "$tests_passed" ] || [ -n "$coverage" ]; then
        printf "\n"
    fi
}

printf "Starting project-wide checks"
if [ "$VERBOSE" = true ]; then printf " (VERBOSE MODE)"; fi
printf "...\n"

# Backend Checks
run_command "$BACKEND_DIR" "npm run lint" "Backend Lint"
run_tests_with_summary "$BACKEND_DIR" "npm run test:coverage" "Backend Tests"

# Frontend Checks
run_command "$FRONTEND_DIR" "npm run lint" "Frontend Lint"
run_command "$FRONTEND_DIR" "npm run typecheck" "Frontend Type-check"
run_tests_with_summary "$FRONTEND_DIR" "npm run test:coverage" "Frontend Tests"

printf "${GREEN}All checks passed successfully!${NC}\n"
