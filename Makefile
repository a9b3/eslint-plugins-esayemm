all: help

help:
	@echo ""
	@echo "  deps       - Installs dependencies"
	@echo "  test       - Runs tests"
	@echo "  test.watch - TDD"
	@echo "  test.%     - Run tests for files with the included name"
	@echo ""

.PHONY: deps
deps:
	@yarn

test:
	@./node_modules/mocha/bin/mocha --recursive tests/rules

test.watch:
	@./node_modules/mocha/bin/mocha --recursive --watch tests/rules

test.%:
	@./node_modules/mocha/bin/mocha --recursive --watch tests/rules
