import unittest
from django.test.runner import DiscoverRunner
from datetime import datetime

class PlainTextTestResult(unittest.TextTestResult):
    def addSuccess(self, test):
        super().addSuccess(test)
        self.stream.write(f"✔ PASÓ: {test}\n")
    
    def addFailure(self, test, err):
        super().addFailure(test, err)
        self.stream.write(f"✖ FALLO: {test}\n   RAZÓN: {self._exc_info_to_string(err, test)}\n")

    def addError(self, test, err):
        super().addError(test, err)
        self.stream.write(f"⚠ ERROR: {test}\n   DETALLES: {self._exc_info_to_string(err, test)}\n")


class PlainTextTestRunner(DiscoverRunner):
    def run_suite(self, suite, **kwargs):
        # Archivo donde se guardan los resultados
        with open("resultado_tests.txt", "w", encoding="utf-8") as f:
            runner = unittest.TextTestRunner(
                stream=f,
                verbosity=2,
                resultclass=PlainTextTestResult
            )
            return runner.run(suite)
